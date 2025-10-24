import { meUpdate } from "@/api/me-update";
import { meUseItem } from "@/api/me-use-item";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";

export type Monster = {
  attack: number;
  maxHitPoint: number;
  hitPoint: number;
  experiencePoint: number;

  // 物理耐性
  slash: number;
  blow: number;
  shoot: number;

  // 属性耐性
  neutral: number;
  flame: number;
  water: number;
  wood: number;
  shine: number;
  dark: number;

  // ドロップアイテム
  weapon: {
    id: number;
    name: string;
  } | null;
  item: {
    id: number;
    name: string;
  } | null;
};

type User = {
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
  private user: User;
  private monster: Monster;
  private buffs = {
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
  private debuffs = {
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

  constructor(user: User, monster: Monster) {
    this.user = user;
    this.monster = monster;
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
    meUseItem({ itemId: item.id });
    this.user.hitPoint = Math.min(
      this.user.hitPoint + item.amount,
      this.user.maxHitPoint
    );
    meUpdate({ hitPoint: this.user.hitPoint });
  }

  public useBuffItem(item: BuffItem): void {
    meUseItem({ itemId: item.id });
    this.buffs[item.target] += Math.floor(item.rate * 10) / 10;
  }

  public useDebuffItem(item: DebuffItem): void {
    meUseItem({ itemId: item.id });
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
    meUpdate({ hitPoint: this.user.hitPoint });
    return {
      userHitPoint: this.user.hitPoint,
      damage: damage,
    };
  }

  // TODO: リファクタ前
  public drop(weaponIds: number[]): {
    drop: {
      id: number;
      type: "weapon" | "item";
    } | null;
    message: string;
  } {
    if (this.monster.weapon && !weaponIds.includes(this.monster.weapon.id)) {
      return {
        drop: {
          id: this.monster.weapon.id,
          type: "weapon",
        },
        message: `${this.monster.weapon.name}を\n落とした！`,
      };
    }

    if (this.monster.item)
      return {
        drop: {
          id: this.monster.item.id,
          type: "item",
        },
        message: `${this.monster.item.name}を\n落とした！`,
      };

    return {
      drop: null,
      message: "何も落とさなかった！",
    };
  }

  public grantExperience(): {
    experiencePoint: number;
  } {
    this.user.experiencePoint += this.monster.experiencePoint;

    return {
      experiencePoint: this.user.experiencePoint,
    };
  }

  public changeExprience({ level }: { level: number }): {
    nextLevelTotalExp: number;
    expToNextLevel: number;
    remainingExp: number;
    currentExp: number;
  } {
    const nextLevelTotalExp = (17 * (level + 1)) ** 2 - 1;
    const levelTotalExp = (17 * level) ** 2 - 1;
    const remainingExp = nextLevelTotalExp - this.user.experiencePoint;
    const expToNextLevel = nextLevelTotalExp - levelTotalExp;
    const currentExp = expToNextLevel - remainingExp;

    return {
      nextLevelTotalExp,
      expToNextLevel,
      remainingExp,
      currentExp,
    };
  }

  public levelUp(): {
    level: number;
    increasedHitPoint: number;
    message: string;
  } | null {
    const level = Math.floor(Math.sqrt(this.user.experiencePoint + 1) / 17);

    if (this.user.level < level) {
      this.user.level = level;
      const increasedHitPoint = [17, 18, 19][Math.floor(Math.random() * 3)];

      return {
        level: this.user.level,
        increasedHitPoint: increasedHitPoint,
        message: `レベルが${level}になった！`,
      };
    }

    return null;
  }
}
