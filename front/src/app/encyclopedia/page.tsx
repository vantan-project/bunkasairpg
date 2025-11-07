"use client";

import { meItemIndex, MeItemIndexResponse } from "@/api/me-item-index";
import { meMonsterIndex, MeMonsterIndexResponse } from "@/api/me-monster-index";
import { meWeaponIndex, MeWeaponIndexResponse } from "@/api/me-weapon-index";
import { monsterShow, MonsterShowResponse } from "@/api/monster-show";
import { ItemCard } from "@/components/feature/battle/item-card";
import { WeaponCard } from "@/components/feature/battle/weapon-card";
import { AssetTypeIcon } from "@/components/shared/asset-type-icon";
import { QuestionIcon } from "@/components/shared/icons/question-icon";
import { Modal } from "@/components/shared/modal";
import { assetBgColor } from "@/utils/asset-bg-color";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

// TODO: 図鑑ページ
// - 図鑑の切り替え
// - ページネーション
// - 背景をカメラにするかどうか
export default function () {
  const [category, setCategory] = useState<"monster" | "weapon" | "item">(
    "item"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [monsterIndex, setMonsterIndex] = useState<MeMonsterIndexResponse>([]);
  const [weaponIndex, setWeaponIndex] = useState<MeWeaponIndexResponse>([]);
  const [itemIndex, setItemIndex] = useState<MeItemIndexResponse>([]);
  const [monster, setMonster] = useState<MonsterShowResponse | null>(null);
  const [weapon, setWeapon] = useState<MeWeaponIndexResponse[number] | null>(
    null
  );
  const [item, setItem] = useState<MeItemIndexResponse[number] | null>(null);

  useEffect(() => {
    if (category === "monster") {
      meMonsterIndex({ currentPage }).then((res) => {
        setMonsterIndex(res.data);
        setTotalPage(res.totalPage);
      });
    } else if (category === "weapon") {
      meWeaponIndex({ currentPage }).then((res) => {
        setWeaponIndex(res.data);
        setTotalPage(res.totalPage);
      });
    } else if (category === "item") {
      meItemIndex({ currentPage }).then((res) => {
        setItemIndex(res.data);
        setTotalPage(res.totalPage);
      });
    }
  }, [category, currentPage]);

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {category === "monster" &&
          monsterIndex.length > 0 &&
          monsterIndex.map((m, index) => (
            <div
              key={index}
              className="bg-neutral relative p-1 rounded-2xl shadow-lg"
              onClick={() => {
                if (m === null) return;
                monsterShow(m.id).then((res) => {
                  setMonster(res);
                });
              }}
            >
              {m ? (
                <div className="relative bg-gray-300 rounded-xl aspect-square flex items-center overflow-hidden">
                  <Image
                    className="object-cover w-full h-auto"
                    src={m.imageUrl}
                    width={200}
                    height={200}
                    alt="monster"
                  />
                </div>
              ) : (
                <div className="bg-gray-300 aspect-square rounded-xl flex items-center justify-center overflow-hidden">
                  <QuestionIcon className="text-white w-16 h-16" />
                </div>
              )}
            </div>
          ))}
        {category === "weapon" &&
          weaponIndex.length > 0 &&
          weaponIndex.map((w, index) => (
            <div
              key={index}
              className={clsx(
                w ? assetBgColor(w.elementType) : "bg-neutral",
                "relative p-1 rounded-2xl shadow-lg"
              )}
              onClick={() => {
                if (w === null) return;
                setWeapon(w);
              }}
            >
              {w ? (
                <div className="relative bg-gray-300 rounded-xl aspect-square flex items-center overflow-hidden">
                  <Image
                    className="object-cover w-full h-auto"
                    src={w.imageUrl}
                    width={200}
                    height={200}
                    alt="weapon"
                  />
                  <div className="absolute w-full px-2 bottom-2 flex gap-2 z-10 justify-end">
                    <AssetTypeIcon type={w.physicsType} size="35%" />
                    <AssetTypeIcon type={w.elementType} size="35%" />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-300 aspect-square rounded-xl flex items-center justify-center overflow-hidden">
                  <QuestionIcon className="text-white w-16 h-16" />
                </div>
              )}
            </div>
          ))}

        {category === "item" &&
          itemIndex.length > 0 &&
          itemIndex.map((i, index) => (
            <div
              key={index}
              className={clsx(
                i ? assetBgColor(i.effectType) : "bg-neutral",
                "relative p-1 rounded-2xl shadow-lg"
              )}
              onClick={() => {
                if (i === null) return;
                setItem(i);
              }}
            >
              {i ? (
                <div className="relative bg-gray-300 rounded-xl aspect-square flex items-center overflow-hidden">
                  <Image
                    className="object-cover w-full h-auto"
                    src={i.imageUrl}
                    width={200}
                    height={200}
                    alt="item"
                  />
                  <div className="absolute w-full px-2 bottom-2 flex gap-2 z-10 justify-end">
                    <AssetTypeIcon type={i.effectType} size="35%" />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-300 aspect-square rounded-xl flex items-center justify-center overflow-hidden">
                  <QuestionIcon className="text-white w-16 h-16" />
                </div>
              )}
            </div>
          ))}
      </div>

      {monster && (
        <Modal onClose={() => setMonster(null)}>
          <div>{monster.name}</div>
        </Modal>
      )}

      {weapon && (
        <Modal onClose={() => setWeapon(null)}>
          <div className="w-screen px-2 text-white">
            <div className="w-full bg-black/70 p-4 rounded-2xl">
              <WeaponCard weapon={weapon} />
            </div>
          </div>
        </Modal>
      )}

      {item && (
        <Modal onClose={() => setItem(null)}>
          <div className="w-screen px-2 text-white">
            <div className="w-full bg-black/70 p-4 rounded-2xl">
              <ItemCard item={item} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
