"use client";

import { ItemIndexRequest, ItemIndexResponse } from "@/api/item-index";
import { BuffIcon } from "@/components/shared/icons/buff-icon";
import { DebuffIcon } from "@/components/shared/icons/debuff-icon";
import { HealIcon } from "@/components/shared/icons/heal-icon";
import { SearchIcon } from "@/components/shared/icons/search-icon";
import { SortIcon } from "@/components/shared/icons/sort-icon";
import { MantineButton } from "@/components/shared/mantine/mantine-button";
import { MantineImage } from "@/components/shared/mantine/mantine-image";
import { MantinePagination } from "@/components/shared/mantine/mantine-pagination";
import { MantineSelect } from "@/components/shared/mantine/mantine-select";
import { MantineTextInput } from "@/components/shared/mantine/mantine-text-input";
import { useAdminContext } from "@/hooks/use-admin-context";
import { EffectType } from "@/types/effect-type";
import clsx from "clsx";
import { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState<ItemIndexRequest>({
    currentPage: 7,

    name: "",
    effectType: null,
    sort: "updatedAt",
    desc: true,
  });
  const [items, setItems] = useState<ItemIndexResponse>([
    {
      id: 1,
      name: "テストアイテム",
      imageUrl: "https://placehold.jp/150x150.png",
      effectType: "heal",
    },
    {
      id: 2,
      name: "テストアイテム",
      imageUrl: "https://placehold.jp/150x150.png",
      effectType: "buff",
    },
    {
      id: 3,
      name: "テストアイテム",
      imageUrl: "https://placehold.jp/150x150.png",
      effectType: "debuff",
    },
  ]);
  const [totalPage, setTotalPage] = useState(10);
  const {
    monsterDrawerOpen,
    isSelected,
    setIsSelected,
    monsterItem,
    setMonsterItem,
  } = useAdminContext();

  const iconClassName =
    "w-8 h-8 flex justify-center items-center rounded-full text-white";
  const getEffectIcon = (effectType: string) => {
    switch (effectType) {
      case "heal":
        return (
          <div className={clsx("bg-pink-300", iconClassName)}>
            <HealIcon />
          </div>
        );
      case "buff":
        return (
          <div className={clsx("bg-red-300", iconClassName)}>
            <BuffIcon />
          </div>
        );
      case "debuff":
        return (
          <div className={clsx("bg-sky-300", iconClassName)}>
            <DebuffIcon />
          </div>
        );
    }
  };

  return (
    <>
      <div className="fixed w-[calc(100vw-270px)] flex justify-between items-end gap-2 bg-white p-2 rounded-lg shadow-lg shadow-violet-400 z-20">
        <div className="flex gap-2 items-end">
          <MantineTextInput
            label="名前"
            classNames={{
              label: "text-sm",
              input: "!w-[200px]",
            }}
            rightSection={<SearchIcon />}
            value={search.name || ""}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
          />
          <MantineSelect
            label="カテゴリ"
            classNames={{
              label: "text-sm",
              input: "!w-[100px]",
            }}
            data={[
              { value: "heal", label: "回復" },
              { value: "buff", label: "バフ" },
              { value: "debuff", label: "デバフ" },
            ]}
            value={search.effectType}
            onChange={(v, _) =>
              setSearch({ ...search, effectType: (v as EffectType) ?? null })
            }
            clearable
          />
          <MantineSelect
            label="ソート"
            classNames={{
              label: "text-sm",
              input: "!w-[120px]",
            }}
            data={[
              { value: "name", label: "名前" },
              { value: "createAt", label: "作成日時" },
              { value: "updatedAt", label: "更新日時" },
            ]}
            value={search.sort}
            onChange={(v, _) =>
              setSearch({
                ...search,
                sort: (v as ItemIndexRequest["sort"]) ?? null,
              })
            }
            clearable
          />
          <MantineButton
            type="button"
            onClick={() => setSearch({ ...search, desc: !search.desc })}
            color="var(--color-black)"
          >
            <SortIcon
              className={clsx(
                "text-white transition-transform duration-300",
                search.desc && "rotate-180"
              )}
            />
          </MantineButton>
        </div>
        <MantinePagination
          total={totalPage}
          value={search.currentPage}
          radius="xl"
          color="var(--color-black)"
          onChange={(v) => setSearch({ ...search, currentPage: v ?? 1 })}
        />
      </div>
      <div className="grid grid-cols-8 gap-4 pt-24">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative transition-transform duration-200 ease-in-out shadow shadow-violet-400 hover:-translate-y-1 hover:shadow-xl bg-white p-1 rounded-2xl"
          >
            <MantineImage radius="lg" src={item.imageUrl} />
            <div className="absolute bottom-2 right-2">
              {getEffectIcon(item.effectType)}
            </div>

            {isSelected && (
              <div
                className="absolute top-0 right-0 w-full h-full flex justify-end items-start"
                onClick={() => {
                  setMonsterItem({
                    id: item.id,
                    name: item.name,
                  });
                  monsterDrawerOpen();
                  setIsSelected(false);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
