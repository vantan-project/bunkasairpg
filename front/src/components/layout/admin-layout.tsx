"use client";

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
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  Badge,
} from "@heroui/react";
import { SearchIcon } from "../shared/icons/search-icon";
import { HealIcon } from "../shared/icons/heal-icon";
import { UserIcon } from "../shared/icons/user-icon";
import { UserStoreModal } from "../feature/admin/user-store-modal";
import { UserHealModal } from "../feature/admin/user-heal-modal";

type Props = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
  const { isOpen: isFilterModalOpen, onOpenChange: onFilterModalOpenChange } =
    useDisclosure();
  const {
    isOpen: isMonsterDrawerOpen,
    onOpenChange: onMonsterDrawerOpenChange,
  } = useDisclosure();
  const { isOpen: isWeaponDrawerOpen, onOpenChange: onWeaponDrawerOpenChange } =
    useDisclosure();
  const { isOpen: isItemDrawerOpen, onOpenChange: onItemDrawerOpenChange } =
    useDisclosure();
  const {
    isOpen: isUserStoreModalOpen,
    onOpenChange: onUserStoreModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isUserHealModalOpen,
    onOpenChange: onUserHealModalOpenChange,
  } = useDisclosure();

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
  const [isFiltered, setIsFiltered] = useState(false);

  const MonsterDropdownMenu = () => (
    <DropdownMenu aria-label="Link Actions">
      <DropdownItem endContent={<ListIcon />} key="index" href="/admin/monster">
        モンスター一覧
      </DropdownItem>
      <DropdownItem
        endContent={<AddIcon />}
        key="store"
        onPress={onMonsterDrawerOpenChange}
      >
        モンスター追加
      </DropdownItem>
    </DropdownMenu>
  );
  const WeaponDropdownMenu = () => (
    <DropdownMenu aria-label="Link Actions">
      <DropdownItem endContent={<ListIcon />} key="index" href="/admin/weapon">
        武器一覧
      </DropdownItem>
      <DropdownItem
        endContent={<AddIcon />}
        key="store"
        onPress={onWeaponDrawerOpenChange}
      >
        武器追加
      </DropdownItem>
    </DropdownMenu>
  );
  const ItemDropdownMenu = () => (
    <DropdownMenu aria-label="Link Actions">
      <DropdownItem endContent={<ListIcon />} key="index" href="/admin/item">
        アイテム一覧
      </DropdownItem>
      <DropdownItem
        endContent={<AddIcon />}
        key="store"
        onPress={onItemDrawerOpenChange}
      >
        アイテム追加
      </DropdownItem>
    </DropdownMenu>
  );
  const UserDropdownMenu = () => (
    <DropdownMenu aria-label="Link Actions">
      <DropdownItem endContent={<ListIcon />} key="index" href="/admin/user">
        ユーザー一覧
      </DropdownItem>
      <DropdownItem
        endContent={<AddIcon />}
        key="store"
        onPress={onUserStoreModalOpenChange}
      >
        ユーザー登録
      </DropdownItem>
      <DropdownItem
        endContent={<HealIcon />}
        key="heal"
        onPress={onUserHealModalOpenChange}
      >
        ユーザー回復
      </DropdownItem>
    </DropdownMenu>
  );

  return (
    <AdminContext.Provider
      value={{
        // 選択中かどうか
        isSelected,
        setIsSelected,

        // モンスター追加ドロワー管理
        onMonsterDrawerOpenChange,

        // モンスター追加時の武器, アイテム管理
        setMonsterWeapon,
        setMonsterItem,

        // サイドバーコンテンツ
        setFilterChildren,
        setPaginationContent,
      }}
    >
      <div className="lg:grid grid-cols-[300px_1fr]">
        <div className="hidden lg:flex flex-col gap-4 items-center pt-4 h-screen">
          <header
            className={clsx(
              isSelected && "opacity-50",
              "relative w-full text-black bg-white rounded-r-xl overflow-hidden shadow-lg shadow-white"
            )}
          >
            {isSelected && (
              <div className="absolute w-full h-full hover:cursor-not-allowed z-20" />
            )}
            <div className="h-2 bg-[linear-gradient(90deg,hsl(194,74%,56%),hsl(266,74%,56%),hsl(338,74%,56%),hsl(50,74%,56%),hsl(122,74%,56%))]" />
            <div className="p-2 pl-4">
              <h1 className="text-lg font-bold pl-2 pb-2">メニュー</h1>
              {[
                {
                  Menu: MonsterDropdownMenu,
                  Icon: MonsterIcon,
                  label: "モンスター管理",
                },
                {
                  Menu: WeaponDropdownMenu,
                  Icon: WeaponIcon,
                  label: "武器管理",
                },
                {
                  Menu: ItemDropdownMenu,
                  Icon: ItemIcon,
                  label: "アイテム管理",
                },
                {
                  Menu: UserDropdownMenu,
                  Icon: UserIcon,
                  label: "ユーザー管理",
                },
              ].map(({ Menu, Icon, label }, index) => (
                <div key={index}>
                  <Dropdown placement="right-start">
                    <DropdownTrigger>
                      <Button
                        fullWidth
                        startContent={<Icon />}
                        variant="light"
                        className="justify-start text-left gap-4"
                      >
                        {label}
                      </Button>
                    </DropdownTrigger>
                    <Menu />
                  </Dropdown>
                </div>
              ))}
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

      <div className="lg:hidden">
        <div className="fixed left-2 top-1/2 flex flex-col gap-2 z-20">
          {[
            {
              Menu: MonsterDropdownMenu,
              Icon: MonsterIcon,
            },
            {
              Menu: WeaponDropdownMenu,
              Icon: WeaponIcon,
            },
            {
              Menu: ItemDropdownMenu,
              Icon: ItemIcon,
            },
            {
              Menu: UserDropdownMenu,
              Icon: UserIcon,
            },
          ].map(({ Menu, Icon }, index) => (
            <div key={index}>
              <Dropdown placement="right-start" key={index}>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    fullWidth
                    variant="light"
                    className="bg-white shadow-lg shadow-white"
                    radius="full"
                    size="lg"
                  >
                    <Icon />
                  </Button>
                </DropdownTrigger>
                <Menu />
              </Dropdown>
            </div>
          ))}
        </div>

        <div className="fixed right-3 bottom-20 z-20">
          <Badge
            color="danger"
            content=""
            className="w-5 h-5 mt-2 mr-2 border-black"
            isInvisible={!isFiltered}
          >
            <Button
              className="w-20 h-20 bg-white shadow-lg shadow-white"
              isIconOnly
              radius="full"
              onPress={() => {
                setIsFiltered(true);
                onFilterModalOpenChange();
              }}
            >
              <SearchIcon className="w-8 h-8" />
            </Button>
          </Badge>
        </div>

        <div className="fixed left-1/2 bottom-4 -translate-x-1/2 z-20">
          {paginationContent}
        </div>
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
      <UserStoreModal
        isOpen={isUserStoreModalOpen}
        onOpenChange={onUserStoreModalOpenChange}
      />
      <UserHealModal
        isOpen={isUserHealModalOpen}
        onOpenChange={onUserHealModalOpenChange}
      />

      <Modal
        isOpen={isFilterModalOpen}
        onOpenChange={onFilterModalOpenChange}
        placement="center"
        classNames={{
          base: "lg:hidden",
          closeButton: "text-2xl mt-2",
        }}
      >
        <ModalContent>
          <div className="h-2 bg-[linear-gradient(90deg,hsl(194,74%,56%),hsl(266,74%,56%),hsl(338,74%,56%),hsl(50,74%,56%),hsl(122,74%,56%))]" />
          <ModalHeader>フィルター</ModalHeader>
          <ModalBody>{filterChildren}</ModalBody>
        </ModalContent>
      </Modal>
    </AdminContext.Provider>
  );
}
