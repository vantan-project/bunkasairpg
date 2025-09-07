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
  itemIndex,
  ItemIndexRequest,
  ItemIndexResponse,
} from "@/api/item-index";
import { AssetTypeIcon } from "@/components/shared/asset-type-icon";
import { SortIcon } from "@/components/shared/icons/sort-icon";
import { assetBgColor } from "@/utils/asset-bg-color";

export default function Page() {
  const [items, setItems] = useState<ItemIndexResponse>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const {
    onMonsterDrawerOpenChange,
    isSelected,
    setIsSelected,
    setMonsterItem,
    setFilterChildren,
    setPaginationContent,
  } = useAdminContext();

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
  const currentPage = watch("currentPage");
  const filterChildren = useMemo(
    () => (
      <div className="flex flex-col gap-2">
        <Input label="名前" variant="bordered" {...register("name")} />
        <Select label="カテゴリ" variant="bordered" {...register("effectType")}>
          <SelectItem key="heal">回復</SelectItem>
          <SelectItem key="buff">バフ</SelectItem>
          <SelectItem key="debuff">デバフ</SelectItem>
        </Select>
        <div className="grid grid-cols-[1fr_80px] gap-2">
          <Select label="ソート" variant="bordered" {...register("sort")}>
            <SelectItem key="name">名前</SelectItem>
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
      itemIndex(form).then(({ data, totalPage }) => {
        setItems(data);
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
      {items.map((item) => (
        <div
          key={item.id}
          className={clsx(
            assetBgColor(item.effectType),
            "relative p-1 rounded-2xl aspect-square shadow-lg shadow-white hover:-translate-y-1"
          )}
        >
          <Image
            className="object-cover w-full h-auto"
            radius="lg"
            src={item.imageUrl}
            removeWrapper
          />
          <div className="absolute w-full px-4 bottom-2 flex gap-2 z-10 justify-end">
            <AssetTypeIcon type={item.effectType} size="35%" />
          </div>
          {isSelected && (
            <div
              className="absolute top-0 right-0 w-full h-full flex justify-end items-start z-10"
              onClick={() => {
                setMonsterItem({
                  id: item.id,
                  name: item.name,
                });
                onMonsterDrawerOpenChange();
                setIsSelected(false);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
