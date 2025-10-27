"use client";
import Image from "next/image";
import clsx from "clsx";
import { assetBgColor } from "@/utils/asset-bg-color";
import { AssetTypeIcon } from "@/components/shared/asset-type-icon";
import { useState } from "react";
import { useGlobalContext } from "@/hooks/use-global-context";
import { useForm } from "react-hook-form";
import { ItemIndexRequest } from "@/api/item-index";

export default function ItemModal() {
  const [useModalOpen, setUseModalOpen] = useState(false);
  const { items } = useGlobalContext();
  const { register, setValue, watch } = useForm<ItemIndexRequest>({
    defaultValues: {
      name: "",
      effectType: null,
      sort: "updatedAt",
      desc: 1,
      currentPage: 1,
    },
  });
  const form = watch();
  const desc = watch("desc");
  const containerClassName =
    "grid grid-cols-3 sm:grid-cols-6 gap-4 h-fit w-full max-h-screen p-4 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden";
  return (
    <div>
      <h1 className="text-4xl mt-10 px-4">所持アイテム</h1>
      <div className={containerClassName}>
        {items.map((item) => (
          <div
            key={item.id}
            className={clsx(
              assetBgColor(item.effectType),
              "relative p-1 rounded-2xl shadow-lg shadow-white hover:-translate-y-1"
            )}
          >
            <div
              className="relative bg-gray-300 rounded-xl aspect-square flex items-center overflow-hidden"
              onClick={() => setUseModalOpen(true)}
            >
              <Image
                className="object-cover w-full h-full"
                src={item.imageUrl}
                alt="アイテム画像"
                width={150}
                height={150}
              />
              <div className="absolute w-full px-2 bottom-2 flex gap-2 z-10 justify-end">
                <AssetTypeIcon type={item.effectType} size="35%" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {useModalOpen && (
        <div className="fixed top-0 left-0 flex flex-col gap-2 justify-center items-center bg-black/70 w-full h-full z-40">
          おにぎり
        </div>
      )}
    </div>
  );
}
