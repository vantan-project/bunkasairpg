import { Modal } from "@/components/feature/battle/modal";
import { useState, useRef, useEffect } from "react";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import { MeItemResponse } from "@/api/me-item";
import { ItemCard } from "./item-card";

export type MeItem =
  | {
      id: number;
      name: string;
      imageUrl: string;
      effectType: "heal";
      amount: number;
      count: number;
    }
  | {
      id: number;
      name: string;
      imageUrl: string;
      effectType: "buff";
      rate: number;
      target: PhysicsType | ElementType;
      count: number;
    }
  | {
      id: number;
      name: string;
      imageUrl: string;
      effectType: "debuff";
      rate: number;
      target: PhysicsType | ElementType;
      count: number;
    };

type Props = {
  items: MeItemResponse;
  item: MeItem;
  setItem: React.Dispatch<React.SetStateAction<MeItem>>;
  handleUseItem: () => void;
};

export function ItemDrawer({ items, item, setItem, handleUseItem }: Props) {
  const [confirmModal, setConfirmModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 2;
  const pageCount = Math.ceil(items.length / itemsPerPage);
  const handleConfirmItem = (item: MeItem) => {
    setConfirmModal(true);
    setItem(item);
  };
  const handleDotClick = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollX = container.clientWidth * index;
    container.scrollTo({ left: scrollX, behavior: "smooth" });
  };
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / container.clientWidth);
      setCurrentIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full">
      {/* 武器スワイプ領域 */}
      <div
        ref={scrollContainerRef}
        className="
            [&::-webkit-scrollbar]:hidden
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            grid grid-rows-2 grid-flow-col
            auto-cols-[100%]
            overflow-x-auto
            gap-4
            py-2
            w-full
            snap-x snap-mandatory
            scroll-smooth
          "
      >
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              handleConfirmItem(item);
            }}
            className="snap-start"
          >
            <ItemCard item={item} />
          </div>
        ))}
      </div>

      {/* ページネーションドット */}
      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              currentIndex === index
                ? "bg-white scale-125"
                : "bg-gray-500 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* 確認モーダル */}
      {confirmModal && (
        <Modal
          onClose={() => setConfirmModal(false)}
          onConfirm={handleUseItem}
          title={`本当に「${item.name}」に\n変更しますか？`}
        />
      )}
    </div>
  );
}
