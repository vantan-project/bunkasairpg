"use client";

import { WeaponIndexRequest, WeaponIndexResponse } from "@/api/weapon-index";
import { BlowIcon } from "@/components/shared/icons/blow-icon";
import { DarkIcon } from "@/components/shared/icons/dark-icon";
import { FlameIcon } from "@/components/shared/icons/flame-icon";
import { NeutralIcon } from "@/components/shared/icons/neutral-icon";
import { SearchIcon } from "@/components/shared/icons/search-icon";
import { ShineIcon } from "@/components/shared/icons/shine-icon";
import { ShootIcon } from "@/components/shared/icons/shoot-icon";
import { SlashIcon } from "@/components/shared/icons/slash-icon";
import { SortIcon } from "@/components/shared/icons/sort-icon";
import { WaterIcon } from "@/components/shared/icons/water-icon";
import { WoodIcon } from "@/components/shared/icons/wood-icon";
import { MantineButton } from "@/components/shared/mantine/mantine-button";
import { MantineImage } from "@/components/shared/mantine/mantine-image";
import { MantinePagination } from "@/components/shared/mantine/mantine-pagination";
import { MantineSelect } from "@/components/shared/mantine/mantine-select";
import { MantineTextInput } from "@/components/shared/mantine/mantine-text-input";
import { useAdminContext } from "@/hooks/use-admin-context";
import { ElementType } from "@/types/element-type";
import { PhysicsType } from "@/types/physics-type";
import clsx from "clsx";
import { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState<WeaponIndexRequest>({
    name: "",
    currentPage: 7,
    physicsType: null,
    elementType: null,
    sort: "updatedAt",
    desc: true,
  });
  const [weapons, setWeapons] = useState<WeaponIndexResponse>([
    {
      id: 1,
      name: "テスト",
      imageUrl: "https://placehold.jp/150x150.png",
      physicsType: "slash",
      elementType: "neutral",
    },
    {
      id: 2,
      name: "テスト",
      imageUrl: "https://placehold.jp/150x150.png",
      physicsType: "blow",
      elementType: "flame",
    },
    {
      id: 3,
      name: "テスト",
      imageUrl: "https://placehold.jp/150x150.png",
      physicsType: "shoot",
      elementType: "water",
    },
    {
      id: 4,
      name: "テスト",
      imageUrl: "https://placehold.jp/150x150.png",
      physicsType: "slash",
      elementType: "wood",
    },
    {
      id: 5,
      name: "テスト",
      imageUrl: "https://placehold.jp/150x150.png",
      physicsType: "blow",
      elementType: "shine",
    },
    {
      id: 6,
      name: "テスト",
      imageUrl: "https://placehold.jp/150x150.png",
      physicsType: "shoot",
      elementType: "dark",
    },
  ]);
  const [totalPage, setTotalPage] = useState(10);
  const {
    monsterDrawerOpen,
    isSelected,
    setIsSelected,
    monsterWeapon,
    setMonsterWeapon,
  } = useAdminContext();

  const iconClassName =
    "w-8 h-8 flex justify-center items-center rounded-full text-white";
  const getPhysicsTypeIcon = (physicsType: string) => {
    switch (physicsType) {
      case "slash":
        return (
          <div className={clsx("bg-gray-300", iconClassName)}>
            <SlashIcon />
          </div>
        );
      case "blow":
        return (
          <div className={clsx("bg-gray-300", iconClassName)}>
            <BlowIcon />
          </div>
        );
      case "shoot":
        return (
          <div className={clsx("bg-gray-300", iconClassName)}>
            <ShootIcon />
          </div>
        );
    }
  };
  const getElementTypeIcon = (elementType: string) => {
    switch (elementType) {
      case "neutral":
        return (
          <div className={clsx("bg-gray-300", iconClassName)}>
            <NeutralIcon />
          </div>
        );
      case "flame":
        return (
          <div className={clsx("bg-red-300", iconClassName)}>
            <FlameIcon />
          </div>
        );
      case "water":
        return (
          <div className={clsx("bg-blue-300", iconClassName)}>
            <WaterIcon />
          </div>
        );
      case "wood":
        return (
          <div className={clsx("bg-green-300", iconClassName)}>
            <WoodIcon />
          </div>
        );
      case "shine":
        return (
          <div className={clsx("bg-yellow-300", iconClassName)}>
            <ShineIcon />
          </div>
        );
      case "dark":
        return (
          <div className={clsx("bg-violet-300", iconClassName)}>
            <DarkIcon />
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
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
          />
          <MantineSelect
            label="物理タイプ"
            classNames={{
              label: "text-sm",
              input: "!w-[100px]",
            }}
            data={[
              { value: "slash", label: "斬撃" },
              { value: "blow", label: "打撃" },
              { value: "shoot", label: "射撃" },
            ]}
            value={search.physicsType}
            onChange={(v, _) =>
              setSearch({ ...search, physicsType: (v as PhysicsType) ?? "" })
            }
            clearable
          />
          <MantineSelect
            label="属性"
            classNames={{
              label: "text-sm",
              input: "!w-[100px]",
            }}
            data={[
              { value: "neutral", label: "無属性" },
              { value: "flame", label: "炎属性" },
              { value: "water", label: "水属性" },
              { value: "wood", label: "木属性" },
              { value: "shine", label: "光属性" },
              { value: "dark", label: "闇属性" },
            ]}
            value={search.elementType}
            onChange={(v, _) =>
              setSearch({ ...search, elementType: (v as ElementType) ?? "" })
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
              { value: "physicsAttack", label: "物理攻撃力" },
              { value: "elementAttack", label: "属性攻撃力" },
              { value: "createAt", label: "作成日時" },
              { value: "updatedAt", label: "更新日時" },
            ]}
            value={search.sort}
            onChange={(v, _) =>
              setSearch({
                ...search,
                sort: (v as WeaponIndexRequest["sort"]) ?? null,
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
        {weapons.map((weapon) => (
          <div
            key={weapon.id}
            className="relative transition-transform duration-200 ease-in-out shadow shadow-violet-400 hover:-translate-y-1 hover:shadow-xl bg-white p-1 rounded-2xl"
          >
            <MantineImage radius="lg" src={weapon.imageUrl} />
            <div className="absolute bottom-2 right-2 flex gap-2">
              {getPhysicsTypeIcon(weapon.physicsType)}
              {getElementTypeIcon(weapon.elementType)}
            </div>
            {isSelected && (
              <div
                className="absolute top-0 right-0 w-full h-full flex justify-end items-start"
                onClick={() => {
                  setMonsterWeapon({
                    id: weapon.id,
                    name: weapon.name,
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
