"use client";

import { MonsterIndexRequest, MonsterIndexResponse } from "@/api/monster-index";
import { SearchIcon } from "@/components/shared/icons/search-icon";
import { SortIcon } from "@/components/shared/icons/sort-icon";
import { MantineButton } from "@/components/shared/mantine/mantine-button";
import { MantineImage } from "@/components/shared/mantine/mantine-image";
import { MantinePagination } from "@/components/shared/mantine/mantine-pagination";
import { MantineSelect } from "@/components/shared/mantine/mantine-select";
import { MantineTextInput } from "@/components/shared/mantine/mantine-text-input";
import clsx from "clsx";
import { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState<MonsterIndexRequest>({
    name: "",
    currentPage: 7,
    sort: "updatedAt",
    desc: true,
  });
  const [monsters, setMonsters] = useState<MonsterIndexResponse>([
    {
      id: "1",
      imageUrl: "https://placehold.jp/150x150.png",
    },
  ]);
  const [totalPage, setTotalPage] = useState(10);

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
            label="ソート"
            classNames={{
              label: "text-sm",
              input: "!w-[120px]",
            }}
            data={[
              { value: "createAt", label: "作成日時" },
              { value: "name", label: "名前" },
              { value: "hitPoint", label: "HP" },
              { value: "attack", label: "攻撃力" },
              { value: "experiencePoint", label: "獲得経験値" },
              { value: "createdAt", label: "作成日時" },
              { value: "updatedAt", label: "更新日時" },
            ]}
            value={search.sort}
            onChange={(v, _) =>
              setSearch({
                ...search,
                sort: (v as MonsterIndexRequest["sort"]) ?? null,
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
        {monsters.map((monster) => (
          <div
            key={monster.id}
            className="relative transition-transform duration-200 ease-in-out shadow shadow-violet-400 hover:-translate-y-1 hover:shadow-xl bg-white p-1 rounded-2xl"
          >
            <MantineImage radius="lg" src={monster.imageUrl} />
          </div>
        ))}
      </div>
    </>
  );
}
