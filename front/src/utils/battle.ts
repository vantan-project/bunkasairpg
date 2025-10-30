import { meGetItem } from "@/api/me-get-item";
import { meGetWeapon } from "@/api/me-get-weapon";
import { meUpdate } from "@/api/me-update";
import { meUseItem } from "@/api/me-use-item";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import { calculateLevel } from "./calculate-level";
import { MonsterShowResponse } from "@/api/monster-show";

export type User = {
  level: number;
  maxHitPoint: number;
  hitPoint: number;
  experiencePoint: number;

  weapon: Weapon;
};

type Weapon = {
  id: number;
  physicsAttack: number;
  elementAttack: number | null;
  physicsType: PhysicsType;
  elementType: ElementType;
};

type HeelItem = {
  id: number;
  amount: number;
};

type BuffItem = {
  id: number;
  rate: number; // 何%増加するか
  target: PhysicsType | ElementType;
};

type DebuffItem = {
  id: number;
  rate: number; // 何%減少するか
  target: PhysicsType | ElementType;
};

export class Battle {
  protected user: User;
  protected monster: MonsterShowResponse & { maxHitPoint: number };
  protected buffs = {
    slash: 0.0,
    blow: 0.0,
    shoot: 0.0,
    neutral: 0.0,
    flame: 0.0,
    water: 0.0,
    wood: 0.0,
    shine: 0.0,
    dark: 0.0,
  };
  protected debuffs = {
    slash: 0.0,
    blow: 0.0,
    shoot: 0.0,
    neutral: 0.0,
    flame: 0.0,
    water: 0.0,
    wood: 0.0,
    shine: 0.0,
    dark: 0.0,
  };
  protected isBoss = false;

  constructor(
    user: User,
    monster: MonsterShowResponse & { maxHitPoint: number }
  ) {
    this.user = user;
    this.monster = monster;
  }

  public getMonster(): MonsterShowResponse & { maxHitPoint: number } {
    return this.monster;
  }

  public attack(): {
    monsterHitPoint: number;
    damage: number;
    monsterResistance: {
      physics: number;
      element: number;
    };
  } {
    const physicsType = this.user.weapon.physicsType;
    const elementType = this.user.weapon.elementType;
    const physics =
      this.user.weapon.physicsAttack *
      (1 + this.buffs[physicsType]) *
      (1 - this.monster[physicsType] * (1 - this.debuffs[physicsType]));
    const element =
      (this.user.weapon.elementAttack || 1) *
      (1 + this.buffs[elementType]) *
      (1 - this.monster[elementType] * (1 - this.debuffs[elementType]));
    const levelFactor = 1 + Math.log10(this.user.level);
    const random = 0.95 + Math.random() * 0.1;

    // (武器攻撃力*(1+物理バフ)*(1-物理耐性*(1-物理デバフ))) *
    // (武器属性値*(1+属性バフ)*(1-属性耐性*(1-属性デバフ))) *
    // (1+log10(レベル)) *
    // 乱数(0.95〜1.05)
    const damage = Math.floor(physics * element * levelFactor * random);

    this.monster.hitPoint =
      damage < 0
        ? Math.min(this.monster.hitPoint - damage, this.monster.maxHitPoint)
        : Math.max(this.monster.hitPoint - damage, 0);
    return {
      monsterHitPoint: this.monster.hitPoint,
      damage: damage,
      monsterResistance: {
        physics: this.monster[physicsType],
        element: this.monster[elementType],
      },
    };
  }

  public changeWeapon(weapon: Weapon): void {
    this.user.weapon = weapon;
    meUpdate({ weaponId: weapon.id });
  }

  public useHealItem(item: HeelItem): void {
    this.isBoss || meUseItem({ itemId: item.id });
    this.user.hitPoint = Math.min(
      this.user.hitPoint + item.amount,
      this.user.maxHitPoint
    );
  }

  public useBuffItem(item: BuffItem): void {
    this.isBoss || meUseItem({ itemId: item.id });
    this.buffs[item.target] += Math.floor(item.rate * 10) / 10;
  }

  public useDebuffItem(item: DebuffItem): void {
    this.isBoss || meUseItem({ itemId: item.id });
    this.debuffs[item.target] += Math.floor(item.rate * 10) / 10;
  }

  public takeDamage(): {
    userHitPoint: number;
    damage: number;
  } {
    const random = 0.95 + Math.random() * 0.1;
    const levelFactor = 1 + Math.sqrt(this.user.level) / 1.7;
    // モンスター攻撃力 * 乱数(0.95〜1.05) / (1+√(ユーザーレベル)/1.7)
    const damage = Math.floor((this.monster.attack * random) / levelFactor);

    this.user.hitPoint = Math.max(this.user.hitPoint - damage, 0);
    return {
      userHitPoint: this.user.hitPoint,
      damage: damage,
    };
  }

  public reward(weaponIds: number[]): {
    level: number;
    hitPoint: number;
    experiencePoint: number;
    drop: "weapon" | "item" | null;
  } {
    let drop: "weapon" | "item" | null = null;
    if (
      this.monster.weapon?.id &&
      !weaponIds.includes(this.monster.weapon.id)
    ) {
      meGetWeapon({ weaponId: this.monster.weapon.id });
      drop = "weapon";
    } else if (this.monster.item?.id) {
      meGetItem({ itemId: this.monster.item.id });
      drop = "item";
    }

    const level = calculateLevel(
      this.user.experiencePoint + this.monster.experiencePoint
    );
    if (this.user.level < level) {
      const increasedHitPoint = Array.from({
        length: level - this.user.level,
      }).reduce<number>(
        (sum) => sum + [6, 7, 8, 9, 10][Math.floor(Math.random() * 5)],
        0
      );
      this.user.level = level;
      this.user.maxHitPoint += increasedHitPoint;
    }
    this.user.experiencePoint += this.monster.experiencePoint;
    process.env.NEXT_PUBLIC_ALLOW_LEVEL_UP === "true" &&
      meUpdate({
        level: this.user.level,
        hitPoint: this.user.maxHitPoint,
        experiencePoint: this.user.experiencePoint,
      });

    return {
      level: this.user.level,
      hitPoint: this.user.maxHitPoint,
      experiencePoint: this.user.experiencePoint,
      drop: drop,
    };
  }
}
