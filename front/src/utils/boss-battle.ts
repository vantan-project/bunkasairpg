import { PhysicsType } from "@/types/physics-type";
import { Battle, User } from "./battle";
import { ElementType } from "@/types/element-type";
import { boss } from "@/const/boss";

export class BossBattle extends Battle {
  constructor(user: User) {
    // TODO: ボスのパラメーターを決める
    super(
      user,
      boss,
      true
    );
  }

  public shiftWeakness(
    physicsType: PhysicsType,
    elementType: ElementType
  ): void {
    const resistance = {
      slash: 1.0,
      blow: 1.0,
      shoot: 1.0,
      neutral: 1.0,
      flame: 1.4,
      water: 1.4,
      wood: 1.4,
      shine: 1.4,
      dark: 1.4,
    };
    resistance[physicsType] = 0.7;
    resistance[elementType] = 0.9;
    this.monster = {
      ...this.monster,
      slash: resistance.slash,
      blow: resistance.blow,
      shoot: resistance.shoot,
      neutral: resistance.neutral,
      flame: resistance.flame,
      water: resistance.water,
      wood: resistance.wood,
      shine: resistance.shine,
      dark: resistance.dark,
    };
  }
}
