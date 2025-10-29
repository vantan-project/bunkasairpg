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
  protected monster: MonsterShowResponse;
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

  constructor(user: User, monster: MonsterShowResponse) {
    this.user = user;
    this.monster = monster;
  }

  public getMonster(): MonsterShowResponse {
    return this.monster;
  }

  public attack(): {
    monsterHitPoint: number;
    damage: number;
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
    const random = 0.95 + Math.random() * 0.1;

    // (武器攻撃力*(1+物理バフ)*(1-物理耐性*(1-物理デバフ))) *
    // (武器属性値*(1+属性バフ)*(1-属性耐性*(1-属性デバフ))) *
    // (レベル/100) *
    // 乱数
    const damage = Math.floor(
      physics * element * (this.user.level / 100) * random
    );

    this.monster.hitPoint =
      damage < 0
        ? Math.min(this.monster.hitPoint - damage, this.monster.maxHitPoint)
        : Math.max(this.monster.hitPoint - damage, 0);
    return {
      monsterHitPoint: this.monster.hitPoint,
      damage: damage,
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
    this.isBoss || meUpdate({ hitPoint: this.user.hitPoint });
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
    // モンスター攻撃力 * (100/レベル) * 乱数
    const random = 0.95 + Math.random() * 0.1;
    const damage = Math.floor(
      this.monster.attack * (100 / this.user.level) * random
    );

    this.user.hitPoint = Math.max(this.user.hitPoint - damage, 0);
    this.isBoss || meUpdate({ hitPoint: this.user.hitPoint });
    return {
      userHitPoint: this.user.hitPoint,
      damage: damage,
    };
  }

  public reward(weaponIds: number[]): {
    level: number;
    hitPoint: number;
    maxHitPoint: number;
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
        (sum) => sum + [17, 18, 19][Math.floor(Math.random() * 3)],
        0
      );
      this.user.level = level;
      this.user.hitPoint += increasedHitPoint;
      this.user.maxHitPoint = this.user.hitPoint;
    }
    this.user.experiencePoint += this.monster.experiencePoint;
    meUpdate({
      level: this.user.level,
      hitPoint: this.user.hitPoint,
      maxHitPoint: this.user.maxHitPoint,
      experiencePoint: this.user.experiencePoint,
    });

    return {
      level: this.user.level,
      hitPoint: this.user.hitPoint,
      maxHitPoint: this.user.maxHitPoint,
      experiencePoint: this.user.experiencePoint,
      drop: drop,
    };
  }
}
