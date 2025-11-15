"use client";

import { meItemIndex, MeItemIndexResponse } from "@/api/me-item-index";
import { meMonsterIndex, MeMonsterIndexResponse } from "@/api/me-monster-index";
import { meWeaponIndex, MeWeaponIndexResponse } from "@/api/me-weapon-index";
import { monsterShow, MonsterShowResponse } from "@/api/monster-show";
import { ItemCard } from "@/components/feature/battle/item-card";
import { WeaponCard } from "@/components/feature/battle/weapon-card";
import { MonsterCard } from "@/components/feature/battle/monster-card";
import { AssetTypeIcon } from "@/components/shared/asset-type-icon";
import { BgCamera } from "@/components/shared/bg-camera";
import { QuestionIcon } from "@/components/shared/icons/question-icon";
import { Modal } from "@/components/shared/modal";
import { assetBgColor } from "@/utils/asset-bg-color";
import { Pagination } from "@heroui/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function () {
  const [category, setCategory] = useState<"monster" | "weapon" | "item">(
    "monster"
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
      <BgCamera />
      <div className="h-[100dvh] w-screen bg-cover bg-center bg-no-repeat flex flex-col items-center font-dotgothic">
        <div className="h-full w-full flex flex-col items-center justify-end">
          <h1 className="text-xl text-white">図鑑</h1>
          <Image
            className="w-[70%] h-[2px]"
            width={100}
            height={100}
            src="/profile-border.png"
            alt="見出しの下線"
          />
          {category === "monster" && (
            <div className="w-[80%] mt-10 grid grid-cols-3 items-end">
              <div className="relative h-14 text-white flex justify-center items-center">
                <Image fill src="/ranking-selected-btn.png" alt="ボタン画像" />
                <div className="absolute text-lg">モンスター</div>
              </div>
              <div
                className="relative h-12 flex justify-center items-center"
                onClick={() => { setCategory("weapon"), setCurrentPage(1) }}
              >
                <Image fill src="/ranking-btn.png" alt="ボタン画像" />
                <div className="absolute">武器</div>
              </div>
              <div
                className="relative h-12 flex justify-center items-center"
                onClick={() => setCategory("item")}
              >
                Ï
                <Image fill src="/ranking-btn.png" alt="ボタン画像" />
                <div className="absolute">アイテム</div>
              </div>
            </div>
          )}
          {category === "weapon" && (
            <div className="w-[80%] mt-10 grid grid-cols-3 items-end">
              <div
                className="relative h-12 flex justify-center items-center"
                onClick={() => setCategory("monster")}
              >
                <Image fill src="/ranking-btn.png" alt="ボタン画像" />
                <div className="absolute">モンスター</div>
              </div>
              <div className="relative h-14 text-white flex justify-center items-center">
                <Image fill src="/ranking-selected-btn.png" alt="ボタン画像" />
                <div className="absolute text-lg">武器</div>
              </div>
              <div
                className="relative h-12 flex justify-center items-center"
                onClick={() => { setCategory("item"), setCurrentPage(1) }}
              >
                Ï
                <Image fill src="/ranking-btn.png" alt="ボタン画像" />
                <div className="absolute">アイテム</div>
              </div>
            </div>
          )}
          {category === "item" && (
            <div className="w-[80%] mt-10 grid grid-cols-3 items-end">
              <div
                className="relative h-12 flex justify-center items-center"
                onClick={() => { setCategory("monster"), setCurrentPage(1) }}
              >
                <Image fill src="/ranking-btn.png" alt="ボタン画像" />
                <div className="absolute">モンスター</div>
              </div>
              <div
                className="relative h-12 flex justify-center items-center"
                onClick={() => { setCategory("weapon"), setCurrentPage(1) }}
              >
                <Image fill src="/ranking-btn.png" alt="ボタン画像" />
                <div className="absolute">武器</div>
              </div>
              <div className="relative h-14 text-white flex justify-center items-center">
                <Image fill src="/ranking-selected-btn.png" alt="ボタン画像" />
                <div className="absolute text-lg">アイテム</div>
              </div>
            </div>
          )}

          <div
            className="relative h-[80%] w-full bg-cover bg-center bg-no-repeat flex flex-col items-center [box-shadow:0_-8px_10px_-1px_rgba(0,0,0,0.25)]"
            style={{ backgroundImage: `url(${"/bg-reward.png"})` }}
          >
            <div className="relative h-[93%] w-full p-6">
              <div className="overflow-y-scroll w-full [&::-webkit-scrollbar]:hidden grid grid-cols-3 gap-2 pt-2 h-fit max-h-[85%] pb-12">
                {category === "monster" &&
                  monsterIndex.length > 0 &&
                  monsterIndex.map((m, index) => (
                    <div
                      key={index}
                      className="bg-neutral relative p-1 rounded-2xl shadow-lg h-fit"
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
                        "relative p-1 rounded-2xl shadow-lg h-fit"
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
                        "relative p-1 rounded-2xl shadow-lg h-fit"
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
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[9%]">
                <Pagination
                  page={currentPage}
                  total={totalPage}
                  classNames={{
                    item: "!bg-[#E0DBD7] !text-black border",
                    cursor:
                      "bg-linear-to-t to-[#661412] from-[#A72731] !text-white",
                  }}
                  onChange={(p) => setCurrentPage(p)}
                />
              </div>
              <Link
                href="/camera"
                className="absolute left-1/2 -translate-x-1/2 -bottom-[3%] w-[30%]"
              >
                <Image
                  className="w-full h-auto"
                  width={100}
                  height={100}
                  src="/back-button.png"
                  alt="戻るボタン"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {monster && (
        <Modal onClose={() => setMonster(null)}>
          <div className="w-screen px-2 text-white">
            <div className="w-full bg-black/70 p-10 rounded-2xl">
              <MonsterCard monster={monster} setMonster={setMonster} />
            </div>
          </div>
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
