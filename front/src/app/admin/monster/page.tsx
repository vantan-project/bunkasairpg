"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import {
  Button,
  Image,
  Input,
  Pagination,
  Select,
  SelectItem,
  Skeleton,
} from "@heroui/react";
import { useAdminContext } from "@/hooks/use-admin-context";
import {
  monsterIndex,
  MonsterIndexRequest,
  MonsterIndexResponse,
} from "@/api/monster-index";
import { SortIcon } from "@/components/shared/icons/sort-icon";

export default function Page() {
  const [monsters, setMonsters] = useState<MonsterIndexResponse>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { setFilterChildren, setPaginationContent } = useAdminContext();

  const { register, setValue, watch } = useForm<MonsterIndexRequest>({
    defaultValues: {
      name: "",
      sort: "updatedAt",
      desc: 1,
      currentPage: 1,
    },
  });

  const form = watch();
  const desc = watch("desc");
  const currentPage = watch("currentPage");
  const filterChildren = useMemo(
    () => (
      <div className="flex flex-col gap-2">
        <Input label="名前" variant="bordered" {...register("name")} />
        <div className="grid grid-cols-[1fr_80px] gap-2">
          <Select label="ソート" variant="bordered" {...register("sort")}>
            <SelectItem key="name">名前</SelectItem>
            <SelectItem key="attack">攻撃力</SelectItem>
            <SelectItem key="hitPoint">HP</SelectItem>
            <SelectItem key="experiencePoint">獲得経験値</SelectItem>
            <SelectItem key="createdAt">作成日時</SelectItem>
            <SelectItem key="updatedAt">更新日時</SelectItem>
          </Select>

          <Button
            className="bg-black text-white h-full"
            onPress={() => setValue("desc", +!desc)}
          >
            <SortIcon
              className={clsx(
                "text-white transition-transform duration-300",
                desc && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>
    ),
    [register, setValue, desc]
  );
  const paginationContent = useMemo(
    () => (
      <Pagination
        classNames={{
          item: "bg-white text-black shadow-[0_7px_10px_-2px_rgba(0,0,0,0.08),0_3px_5px_-1px_rgba(0,0,0,0.04)] shadow-white",
          cursor: "bg-black text-white border border-white",
        }}
        total={totalPage}
        page={currentPage}
        onChange={(v) => setValue("currentPage", v)}
      />
    ),
    [totalPage, currentPage, setValue]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      monsterIndex(form).then(({ data, totalPage }) => {
        setMonsters(data);
        setTotalPage(totalPage);
        setIsLoading(false);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [JSON.stringify(form)]);

  useEffect(() => {
    setFilterChildren(filterChildren);
  }, [filterChildren, setFilterChildren]);

  useEffect(() => {
    setPaginationContent(paginationContent);
  }, [paginationContent, setPaginationContent]);

  const containerClassName =
    "grid grid-cols-3 sm:grid-cols-6 gap-4 h-fit max-h-screen p-4 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden";
  if (isLoading) {
    return (
      <div className={containerClassName}>
        {Array.from({ length: 30 }).map((_, i) => (
          <Skeleton className="aspect-square rounded-2xl" key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {monsters.map((monster) => (
        <div
          key={monster.id}
          className="bg-neutral relative p-1 rounded-2xl aspect-square shadow-lg shadow-white hover:-translate-y-1"
        >
          <Image
            className="object-cover w-full h-auto"
            radius="lg"
            src={monster.imageUrl}
            removeWrapper
          />
        </div>
      ))}
    </div>
  );
}
