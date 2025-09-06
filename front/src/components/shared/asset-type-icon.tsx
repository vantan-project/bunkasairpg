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

type Props = {
  type: PhysicsType | ElementType | EffectType;
  size: string;
};

export function AssetTypeIcon({ type, size }: Props) {
  const assetTypeIconMap = {
    slash: { Icon: SlashIcon, colorClass: "bg-gray-300" },
    blow: { Icon: BlowIcon, colorClass: "bg-gray-300" },
    shoot: { Icon: ShootIcon, colorClass: "bg-gray-300" },
    neutral: { Icon: NeutralIcon, colorClass: "bg-gray-300" },
    flame: { Icon: FlameIcon, colorClass: "bg-red-300" },
    water: { Icon: WaterIcon, colorClass: "bg-blue-300" },
    wood: { Icon: WoodIcon, colorClass: "bg-green-300" },
    shine: { Icon: ShineIcon, colorClass: "bg-yellow-300" },
    dark: { Icon: DarkIcon, colorClass: "bg-violet-300" },
    heal: { Icon: HealIcon, colorClass: "bg-pink-300" },
    buff: { Icon: BuffIcon, colorClass: "bg-red-300" },
    debuff: { Icon: DebuffIcon, colorClass: "bg-sky-300" },
  };

  const { Icon, colorClass } = assetTypeIconMap[type];
  return (
    <div
      className={clsx(
        colorClass,
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
