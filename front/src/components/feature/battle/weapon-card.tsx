import clsx from "clsx";
import Image from "next/image";
import { MeWeapon } from "./weapon-drawer";
import { assetGradation } from "@/utils/asset-gradation";
import { AssetTypeIcon } from "@/components/shared/asset-type-icon";
import { useGlobalContext } from "@/hooks/use-global-context";

type Props = {
  weapon: MeWeapon;
};

export function WeaponCard({ weapon }: Props) {
  const { user } = useGlobalContext();
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
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <div
        className={clsx("p-1 rounded-md", assetGradation(weapon.elementType))}
      >
        <div className="relative aspect-square bg-gray-300">
          {user.weapon.id === weapon.id && (
            <div className="absolute top-0 left-0 bg-[#666666]/80 z-10">
              装備中
            </div>
          )}

          <div className="absolute w-full px-1 bottom-2 flex gap-2 z-10 justify-end">
            <AssetTypeIcon type={weapon.physicsType} size="30%" />
            <AssetTypeIcon type={weapon.elementType} size="30%" />
          </div>

          <Image src={weapon.imageUrl} alt="武器画像" fill priority />
        </div>
      </div>

      <div className="h-full flex flex-col justify-between">
        <div className="text-white text-lg font-bold">
          <p>{weapon.name}</p>
        </div>
        {[
          {
            label: "攻撃力",
            value: weapon.physicsAttack,
          },
          {
            label: "属性値",
            value: weapon.elementAttack || 0,
          },
          {
            label: "属性",
            value: elementsTypeMap[weapon.elementType],
          },
          {
            label: "物理タイプ",
            value: physicsTypeMap[weapon.physicsType],
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className={clsx(
              dotBorderClassName,
              "flex justify-between items-end px-1"
            )}
          >
            <p className="text-[#bababa] text-sm pb-0.5">{label}</p>
            <p className="text-lg">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
