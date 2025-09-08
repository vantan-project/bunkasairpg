import { PhysicsType } from "@/types/physics-type";
import { BlowIcon } from "./icons/blow-icon";
import { DarkIcon } from "./icons/dark-icon";
import { FlameIcon } from "./icons/flame-icon";
import { NeutralIcon } from "./icons/neutral-icon";
import { ShineIcon } from "./icons/shine-icon";
import { ShootIcon } from "./icons/shoot-icon";
import { SlashIcon } from "./icons/slash-icon";
import { WaterIcon } from "./icons/water-icon";
import { WoodIcon } from "./icons/wood-icon";
import { ElementType } from "@/types/element-type";
import { EffectType } from "@/types/effect-type";
import { HealIcon } from "./icons/heal-icon";
import { BuffIcon } from "./icons/buff-icon";
import { DebuffIcon } from "./icons/debuff-icon";
import clsx from "clsx";
import { assetBgColor } from "@/utils/asset-bg-color";

type Props = {
  type: PhysicsType | ElementType | EffectType;
  size: string;
};

const assetTypeIconMap = {
  slash: SlashIcon,
  blow: BlowIcon,
  shoot: ShootIcon,
  neutral: NeutralIcon,
  flame: FlameIcon,
  water: WaterIcon,
  wood: WoodIcon,
  shine: ShineIcon,
  dark: DarkIcon,
  heal: HealIcon,
  buff: BuffIcon,
  debuff: DebuffIcon,
};

export function AssetTypeIcon({ type, size }: Props) {
  const Icon = assetTypeIconMap[type];
  return (
    <div
      className={clsx(
        assetBgColor(type),
        "flex justify-center items-center rounded-full text-white p-[4%] aspect-square"
      )}
      style={{
        width: size,
      }}
    >
      <Icon className="w-full h-full" />
    </div>
  );
}
