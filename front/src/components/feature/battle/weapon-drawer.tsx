import { Modal } from "@/components/feature/battle/modal";
import { useRef, useState, useEffect } from "react";
import { MeWeaponResponse } from "@/api/me-weapon";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import { WeaponCard } from "./weapon-card";

export type MeWeapon = {
  id: number;
  name: string;
  imageUrl: string;
  physicsAttack: number;
  elementAttack: number | null;
  physicsType: PhysicsType;
  elementType: ElementType;
};

type Props = {
  weapons: MeWeaponResponse;
  weapon: MeWeapon;
  setWeapon: React.Dispatch<React.SetStateAction<MeWeapon>>;
  handleChangeWeapon: () => void;
};

export function WeaponDrawer({
  weapons,
  weapon,
  setWeapon,
  handleChangeWeapon,
}: Props) {
  const [confirmModal, setConfirmModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 2;
  const pageCount = Math.ceil(weapons.length / itemsPerPage);

  const handleConfirmWeapon = (weapon: MeWeapon) => {
    setConfirmModal(true);
    setWeapon(weapon);
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
        {weapons.map((we, index) => (
          <div
            key={index}
            onClick={() => {weapon.id === we.id ? {} : handleConfirmWeapon(we)}}
            className="snap-start"
          >
            <WeaponCard weapon={we} selectedWeaponId={weapon.id} />
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
          onConfirm={handleChangeWeapon}
          title={`本当に「${weapon.name}」に\n変更しますか？`}
        />
      )}
    </div>
  );
}
