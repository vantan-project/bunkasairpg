import clsx from "clsx";
import Image from "next/image";
import { MeWeapon } from "./weapon-drawer";

type Props = {
  weapon: MeWeapon;
  selectedWeaponId: number;
};

export function WeaponCard({ weapon, selectedWeaponId }: Props) {
  const physicsTypeMap: Record<string, string> = {
    slash: "斬撃",
    blow: "打撃",
    shoot: "射撃",
  };
  const elementsTypeMap: Record<string, string> = {
    neutral: "無",
    flame: "炎",
    water: "水",
    wood: "木",
    shine: "光",
    dark: "闇",
  };

  const dotBorderClassName =
    "bg-[linear-gradient(to_right,#666_6px,transparent_2px,transparent_5px)] bg-[length:10px_2px] bg-bottom bg-repeat-x";
  return (
    <div className="flex">
      <div className="relative flex-[2] w-[35%] aspect-square">
        <div className="absolute top-0 left-0">装備中</div>
        <Image src={weapon.imageUrl} alt="武器画像" fill priority />
      </div>
      <div className="ml-2 flex-[3] flex-col w-full">
    
        <div className={clsx(dotBorderClassName, "text-white")}>
          <p>{weapon.name}</p>
        </div>
        <div className={clsx(dotBorderClassName, "flex justify-between")}>
          <p className="text-label">物理タイプ</p>
          <p>{physicsTypeMap[weapon.physicsType]}</p>
        </div>
        <div className={clsx(dotBorderClassName, "flex justify-between")}>
          <p className="text-label">攻撃力</p>
          <p>{weapon.physicsAttack}</p>
        </div>
        <div className={clsx(dotBorderClassName, "flex justify-between")}>
          <p className="text-label">属性</p>
          <p>{elementsTypeMap[weapon.elementType]}</p>
        </div>
        <div className={clsx(dotBorderClassName, "flex justify-between")}>
          <p className="text-label">属性値</p>
          <p>{weapon.elementAttack}</p>
        </div>
      </div>
    </div>
  );
}
