import { EffectType } from "@/types/effect-type";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";

type ItemEffect =
  | {
      effectType: "heal";
      amount: number;
    }
  | {
      effectType: "buff";
      rate: number;
      target: PhysicsType | ElementType;
    }
  | {
      effectType: "debuff";
      rate: number;
      target: PhysicsType | ElementType;
    };

const tagrgetLabelMap = {
  slash: "斬撃",
  blow: "打撃",
  shoot: "射撃",
  neutral: "無属性",
  flame: "火属性",
  water: "水属性",
  wood: "木属性",
  shine: "光属性",
  dark: "闇属性",
};

export function itemDetailText(effect: ItemEffect): string {
  if (effect.effectType === "buff") {
    return `自身の${tagrgetLabelMap[effect.target]}火力を${Math.floor(
      effect.rate * 100
    )}%増加する。`;
  }

  if (effect.effectType === "debuff") {
    return `敵モンスターの${tagrgetLabelMap[effect.target]}耐性を${Math.floor(
      effect.rate * 100
    )}%減少する。`;
  }

  return `HPを${effect.amount}回復する。`;
}