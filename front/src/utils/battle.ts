import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";

type Monster = {
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
  ice: number;
  thunder: number;

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
  name: string;
  physicsAttack: number;
  elementAttack: number | null;
  physicsType: PhysicsType;
  elementType: ElementType;
};

type HeelItem = {
  name: string;
  logicType: "heal";
  amount: number;
};

type BuffItem = {
  name: string;
  logicType: "buff";
  rate: number; // 何%増加するか
  target: PhysicsType | ElementType;
};

type DebuffItem = {
  name: string;
  logicType: "debuff";
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
    ice: 0.0,
    thunder: 0.0,
  };
  private debuffs = {
    slash: 0.0,
    blow: 0.0,
    shoot: 0.0,
    neutral: 0.0,
    flame: 0.0,
    water: 0.0,
    ice: 0.0,
    thunder: 0.0,
  };

  constructor(user: User, monster: Monster) {
    this.user = user;
    this.monster = monster;
  }

  public attack(): {
    monsterHitPoint: number;
    isFinished: boolean;
    message: string;
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

    if (this.monster.hitPoint === 0)
      return {
        monsterHitPoint: this.monster.hitPoint,
        isFinished: true,
        message: "モンスターを倒した！",
      };

    if (damage === 0)
      return {
        monsterHitPoint: this.monster.hitPoint,
        isFinished: false,
        message: "モンスターの防御に阻まれた！",
      };

    if (damage < 0)
      return {
        monsterHitPoint: this.monster.hitPoint,
        isFinished: false,
        message: `${-damage}ダメージが吸収された！`,
      };

    return {
      monsterHitPoint: this.monster.hitPoint,
      isFinished: false,
      message: `${damage}のダメージを与えた！`,
    };
  }

  public changeWeapon(weapon: Weapon): {
    message: string;
  } {
    this.user.weapon = weapon;
    return {
      message: `武器を${weapon.name}に変更した！`,
    };
  }

  public useHealItem(item: HeelItem): {
    userHitPoint: number;
    message: string;
  } {
    const healedAmount = Math.min(
      item.amount,
      this.user.maxHitPoint - this.user.hitPoint
    );
    this.user.hitPoint += healedAmount;
    return {
      userHitPoint: this.user.hitPoint,
      message: `${healedAmount}回復した！`,
    };
  }

  public useBuffItem(item: BuffItem): {
    message: string;
  } {
    this.buffs[item.target] += Math.floor(item.rate * 10) / 10;
    return {
      message: `${item.name}を使った！`,
    };
  }

  public useDebuffItem(item: DebuffItem): {
    message: string;
  } {
    this.debuffs[item.target] += Math.floor(item.rate * 10) / 10;
    return {
      message: `${item.name}を使った！`,
    };
  }

  public takeDamage(): {
    userHitPoint: number;
    isFinished: boolean;
    message: string;
  } {
    // モンスター攻撃力 * (100/レベル) * 乱数
    const random = 0.95 + Math.random() * 0.1;
    const damage = this.monster.attack * (100 / this.user.level) * random;

    this.user.hitPoint = Math.max(this.user.hitPoint - damage, 0);

    if (this.user.hitPoint === 0)
      return {
        userHitPoint: this.user.hitPoint,
        isFinished: true,
        message: "モンスターに倒された！",
      };

    return {
      userHitPoint: this.user.hitPoint,
      isFinished: false,
      message: `${damage}のダメージを受けた！`,
    };
  }

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
        message: `${this.monster.weapon.name}を落とした！`,
      };
    }

    if (this.monster.item)
      return {
        drop: {
          id: this.monster.item.id,
          type: "item",
        },
        message: `${this.monster.item.name}を落とした！`,
      };

    return {
      drop: null,
      message: "何も落とさなかった！",
    };
  }

  public grantExperience(): {
    experiencePoint: number;
    message: string;
  } {
    this.user.experiencePoint += this.monster.experiencePoint;

    return {
      experiencePoint: this.monster.experiencePoint,
      message: `${this.monster.experiencePoint}の経験値を獲得した！`,
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
