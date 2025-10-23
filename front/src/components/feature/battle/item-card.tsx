import clsx from "clsx";
import Image from "next/image";
import { MeItem } from "./item-drawer";
import { assetGradation } from "@/utils/asset-gradation";
import { AssetTypeIcon } from "@/components/shared/asset-type-icon";
import { ITEM_TARGET_LABEL_MAP } from "@/const/item-target-label-map";

type Props = {
  item: MeItem;
};

export function ItemCard({ item }: Props) {
  const itemDetailText = () => {
    if (item.effectType === "buff") {
      return `自身の${ITEM_TARGET_LABEL_MAP[item.target]}火力が${Math.floor(
        item.rate * 100
      )}%上昇する。`;
    }

    if (item.effectType === "debuff") {
      return `敵モンスターの${
        ITEM_TARGET_LABEL_MAP[item.target]
      }耐性を${Math.floor(item.rate * 100)}%低下させる。`;
    }

    return `HPを${item.amount}回復する。`;
  };

  const dotBorderClassName =
    "bg-[linear-gradient(to_right,#666_6px,transparent_2px,transparent_5px)] bg-[length:10px_2px] bg-bottom bg-repeat-x";
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <div className={clsx("p-1 rounded-md", assetGradation(item.effectType))}>
        <div className="relative aspect-square bg-gray-300">
          <div className="absolute w-full px-1 bottom-2 flex gap-2 z-10 justify-end">
            <AssetTypeIcon type={item.effectType} size="30%" />
          </div>

          <Image src={item.imageUrl} alt="武器画像" fill priority />
        </div>
      </div>
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-white text-lg font-bold">
            <p>{item.name}</p>
          </div>
          <div className={clsx(dotBorderClassName, "px-1 text-sm pb-0.5")}>
            {itemDetailText()}
          </div>
        </div>

        <div className="w-full flex justify-end items-end gap-[1px] pr-2 pb-2">
          <p className={clsx(dotBorderClassName, "w-12 text-center")}>
            <span>×</span>
            <span className="text-white text-xl">{item.count}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
