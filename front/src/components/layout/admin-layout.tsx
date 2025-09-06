import { useRouter } from "next/navigation";
import { MonsterStoreDrawer } from "../feature/admin/monster-store-drawar";
import { useState } from "react";
import { ItemStoreDrawer } from "../feature/admin/item-store-drawar";
import { WeaponStoreDrawer } from "../feature/admin/weapon-store-drawar";
import { MonsterIcon } from "../shared/icons/monster-icon";
import { WeaponIcon } from "../shared/icons/weapon-icon";
import { ItemIcon } from "../shared/icons/item-icon";
import { ListIcon } from "../shared/icons/list-icon";
import { AddIcon } from "../shared/icons/add-icon";
import { AdminContext } from "@/hooks/use-admin-context";
import clsx from "clsx";
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@heroui/react";

type Props = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
  const router = useRouter();
  const {
    isOpen: isMonsterDrawerOpen,
    onOpenChange: onMonsterDrawerOpenChange,
  } = useDisclosure();
  const { isOpen: isWeaponDrawerOpen, onOpenChange: onWeaponDrawerOpenChange } =
    useDisclosure();
  const { isOpen: isItemDrawerOpen, onOpenChange: onItemDrawerOpenChange } =
    useDisclosure();

  const [monsterWeapon, setMonsterWeapon] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [monsterItem, setMonsterItem] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [filterChildren, setFilterChildren] = useState<React.ReactNode>(null);
  const [paginationContent, setPaginationContent] =
    useState<React.ReactNode>(null);

  const iconClassName = "w-6 h-6";
  return (
    <AdminContext.Provider
      value={{
        // モンスター追加ドロワー管理
        isMonsterDrawerOpen,
        onMonsterDrawerOpenChange,

        // モンスター追加時の武器管理
        monsterWeapon,
        setMonsterWeapon,

        // モンスター追加時のアイテム管理
        monsterItem,
        setMonsterItem,

        // 選択中かどうか
        isSelected,
        setIsSelected,

        // サイドバーコンテンツ
        setFilterChildren,
        setPaginationContent,
      }}
    >
      <div className="lg:grid grid-cols-[300px_1fr]">
        <div
          className={clsx(
            isSelected && "opacity-50",
            "relative hidden lg:flex flex-col gap-4 items-center pt-4"
          )}
        >
          {isSelected && (
            <div className="absolute w-full h-full hover:cursor-not-allowed z-20" />
          )}
          <header className="w-full text-black bg-white rounded-r-xl overflow-hidden shadow-lg shadow-white">
            <div className="h-2 bg-[linear-gradient(90deg,hsl(194,74%,56%),hsl(266,74%,56%),hsl(338,74%,56%),hsl(50,74%,56%),hsl(122,74%,56%))]" />

            <div className="p-2 pl-4">
              <h1 className="text-lg font-bold pl-2 pb-2">メニュー</h1>
              <Dropdown placement="right-start">
                <DropdownTrigger>
                  <Button
                    fullWidth
                    startContent={<MonsterIcon />}
                    variant="light"
                    className="justify-start text-left gap-4"
                  >
                    モンスター管理
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Link Actions">
                  <DropdownItem
                    endContent={<ListIcon className={iconClassName} />}
                    key="index"
                    href="/admin/monster"
                  >
                    モンスター一覧
                  </DropdownItem>
                  <DropdownItem
                    endContent={<AddIcon className={iconClassName} />}
                    key="store"
                    onPress={onMonsterDrawerOpenChange}
                  >
                    モンスター追加
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Dropdown placement="right-start">
                <DropdownTrigger>
                  <Button
                    fullWidth
                    startContent={<WeaponIcon />}
                    variant="light"
                    className="justify-start text-left gap-4"
                  >
                    武器管理
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Link Actions">
                  <DropdownItem
                    endContent={<ListIcon className={iconClassName} />}
                    key="index"
                    href="/admin/weapon"
                  >
                    武器一覧
                  </DropdownItem>
                  <DropdownItem
                    endContent={<AddIcon className={iconClassName} />}
                    key="store"
                    onPress={onWeaponDrawerOpenChange}
                  >
                    武器追加
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Dropdown placement="right-start">
                <DropdownTrigger>
                  <Button
                    fullWidth
                    startContent={<ItemIcon />}
                    variant="light"
                    className="justify-start text-left gap-4"
                  >
                    アイテム管理
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Link Actions">
                  <DropdownItem
                    endContent={<ListIcon className={iconClassName} />}
                    key="index"
                    href="/admin/item"
                  >
                    アイテム一覧
                  </DropdownItem>
                  <DropdownItem
                    endContent={<AddIcon className={iconClassName} />}
                    key="store"
                    onPress={onItemDrawerOpenChange}
                  >
                    アイテム追加
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </header>

          <div className="w-full text-black bg-white rounded-r-xl overflow-hidden shadow-lg shadow-white">
            <div className="h-2 bg-[linear-gradient(90deg,hsl(194,74%,56%),hsl(266,74%,56%),hsl(338,74%,56%),hsl(50,74%,56%),hsl(122,74%,56%))]" />
            <div className="p-2 pl-4">
              <h1 className="text-lg font-bold pl-2 pb-2">フィルター</h1>
              {filterChildren}
            </div>
          </div>

          <div className="pl-4">{paginationContent}</div>
        </div>

        <div>{children}</div>
      </div>

      <MonsterStoreDrawer
        isOpen={isMonsterDrawerOpen}
        onOpenChange={onMonsterDrawerOpenChange}
        weapon={monsterWeapon}
        item={monsterItem}
      />
      <WeaponStoreDrawer
        isOpen={isWeaponDrawerOpen}
        onOpenChange={onWeaponDrawerOpenChange}
      />
      <ItemStoreDrawer
        isOpen={isItemDrawerOpen}
        onOpenChange={onItemDrawerOpenChange}
      />
    </AdminContext.Provider>
  );
}
