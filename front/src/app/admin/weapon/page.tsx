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
} from "@heroui/react";
import { useAdminContext } from "@/hooks/use-admin-context";
import {
  weaponIndex,
  WeaponIndexRequest,
  WeaponIndexResponse,
} from "@/api/weapon-index";
import { AssetTypeIcon } from "@/components/shared/asset-type-icon";
import { SortIcon } from "@/components/shared/icons/sort-icon";

export default function Page() {
  const [weapons, setWeapons] = useState<WeaponIndexResponse>([]);
  const [totalPage, setTotalPage] = useState(1);
  const {
    onMonsterDrawerOpenChange,
    isSelected,
    setIsSelected,
    setMonsterWeapon,
    setFilterChildren,
    setPaginationContent,
  } = useAdminContext();

  const { register, setValue, watch } =
    useForm<WeaponIndexRequest>({
      defaultValues: {
        name: "",
        physicsType: undefined,
        elementType: undefined,
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
        <Select
          label="攻撃タイプ"
          variant="bordered"
          {...register("physicsType")}
        >
          <SelectItem key="slash">斬撃</SelectItem>
          <SelectItem key="blow">打撃</SelectItem>
          <SelectItem key="shoot">射撃</SelectItem>
        </Select>
        <Select label="属性" variant="bordered" {...register("elementType")}>
          <SelectItem key="neutral">無属性</SelectItem>
          <SelectItem key="flame">炎属性</SelectItem>
          <SelectItem key="water">水属性</SelectItem>
          <SelectItem key="wood">木属性</SelectItem>
          <SelectItem key="shine">光属性</SelectItem>
          <SelectItem key="dark">闇属性</SelectItem>
        </Select>
        <div className="grid grid-cols-[1fr_80px] gap-2">
          <Select label="ソート" variant="bordered" {...register("sort")}>
            <SelectItem key="name">名前</SelectItem>
            <SelectItem key="physicsAttack">物理攻撃力</SelectItem>
            <SelectItem key="elementAttack">属性攻撃力</SelectItem>
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
      weaponIndex(form).then(({ data, totalPage }) => {
        setWeapons(data);
        setTotalPage(totalPage);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [form]);

  useEffect(() => {
    setFilterChildren(filterChildren);
  }, [filterChildren, setFilterChildren]);

  useEffect(() => {
    setPaginationContent(paginationContent);
  }, [paginationContent, setPaginationContent]);

  return (
    <div className="grid grid-cols-6 gap-4 h-screen p-4 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden">
      {weapons.map((weapon) => (
        <div
          key={weapon.id}
          className="relative bg-white p-1 rounded-2xl aspect-square shadow-lg shadow-white hover:-translate-y-1"
        >
          <Image
            className="object-cover w-full h-auto"
            radius="lg"
            src={weapon.imageUrl}
            removeWrapper
          />
          <div className="absolute w-full px-4 bottom-2 flex gap-2 z-10 justify-end">
            <AssetTypeIcon type={weapon.physicsType} size="35%" />
            <AssetTypeIcon type={weapon.elementType} size="35%" />
          </div>
          {isSelected && (
            <div
              className="absolute top-0 right-0 w-full h-full flex justify-end items-start z-10"
              onClick={() => {
                setMonsterWeapon({
                  id: weapon.id,
                  name: weapon.name,
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
