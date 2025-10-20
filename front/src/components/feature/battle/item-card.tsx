import clsx from "clsx";
import Image from "next/image";
import { MeItem } from "./item-drawer";

type Props = {
  item: MeItem;
};

export function ItemCard({ item }: Props) {
  const effectTypeMap: Record<string, string> = {
    heal: "回復系",
    buff: "バフ系",
    debuff: "デバフ系",
  };

  const dotBorderClassName =
    "bg-[linear-gradient(to_right,#666_6px,transparent_2px,transparent_5px)] bg-[length:10px_2px] bg-bottom bg-repeat-x";
  return (
    <div className="flex">
      <div className="relative flex-[2] w-[35%] aspect-square">
        <Image src={item.imageUrl} alt="武器画像" fill priority />
      </div>
      <div className="ml-2 flex-[3] flex-col w-full">
    
        <div className={clsx(dotBorderClassName, "text-white")}>
          <p>{item.name}</p>
        </div>
        <div className={clsx(dotBorderClassName, "flex justify-between")}>
          <p className="text-label">効果タイプ</p>
          <p>{effectTypeMap[item.effectType]}</p>
        </div>
        <div className={clsx(dotBorderClassName, "flex justify-between")}>
          <p className="text-label">効果</p>
          <p></p>
        </div>
        <div className={clsx(dotBorderClassName, "flex justify-between")}>
          <p className="text-label">個数</p>
          <p>{item.count}</p>
        </div>
      </div>
    </div>
  );
}
