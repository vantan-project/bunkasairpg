import { useRouter } from "next/navigation";
import { MonsterStoreDrawer } from "../feature/admin/monster-store-drawar";
import { useEffect, useState } from "react";
import { ItemStoreDrawer } from "../feature/admin/item-store-drawar";
import { WeaponStoreDrawer } from "../feature/admin/weapon-store-drawar";
import { MantineNavLink } from "../shared/mantine/mantine-nav-link";
import { MonsterIcon } from "../shared/icons/monster-icon";
import { WeaponIcon } from "../shared/icons/weapon-icon";
import { ItemIcon } from "../shared/icons/item-icon";
import { ListIcon } from "../shared/icons/list-icon";
import { AddIcon } from "../shared/icons/add-icon";
import { useDisclosure } from "@mantine/hooks";
import { AdminContext } from "@/hooks/use-admin-context";
import clsx from "clsx";
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

type Props = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
  const router = useRouter();
  // const {
  //   isMonsterDrawerOpen,
  //   onMonsterDrawerOpen,
  //   onMonsterDrawerOpenChange,
  // } = useDisclosure();
  // const { isWeaponDrawerOpen, onWeaponDrawerOpen, onWeaponDrawerOpenChange } =
  //   useDisclosure();
  // const { isItemDrawerOpen, onItemDrawerOpen, onItemDrawerOpenChange } =
  //   useDisclosure();
  const [monsterDrawerOpened, monsterDrawerHandlers] = useDisclosure(false);
  const [weaponDrawerOpened, weaponDrawerHandlers] = useDisclosure(false);
  const [itemDrawerOpened, itemDrawerHandlers] = useDisclosure(false);
  const [monsterWeapon, setMonsterWeapon] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [monsterItem, setMonsterItem] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const iconClassName = "w-4 h-4";
  return (
    <AdminContext.Provider
      value={{
        monsterDrawerOpened,
        monsterDrawerOpen: monsterDrawerHandlers.open,
        monsterDrawerClose: monsterDrawerHandlers.close,
        monsterWeapon,
        setMonsterWeapon,
        monsterItem,
        setMonsterItem,
        isSelected,
        setIsSelected,
      }}
    >
      <div className="pl-64 pr-4 pt-4">
        <header
          className={clsx(
            isSelected && "opacity-50 pointer-events-none",
            "w-56 flex flex-col text-black fixed top-0 left-0 z-20 m-4 bg-white p-2 rounded-2xl shadow-lg shadow-violet-400"
          )}
        >
          <h1 className="text-xl font-bold pl-2">メニュー</h1>

          <Dropdown placement="right-start">
            <DropdownTrigger>
              <Button
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
                onPress={() => {}}
              >
                モンスター追加
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown placement="right-start">
            <DropdownTrigger>
              <Button
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
                onPress={() => {}}
              >
                武器追加
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown placement="right-start">
            <DropdownTrigger>
              <Button
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
                onPress={() => {}}
              >
                アイテム追加
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </header>
        {children}
      </div>

      <MonsterStoreDrawer
        opened={monsterDrawerOpened}
        close={monsterDrawerHandlers.close}
        weapon={monsterWeapon}
        item={monsterItem}
      />
      <WeaponStoreDrawer
        opened={weaponDrawerOpened}
        close={weaponDrawerHandlers.close}
      />
      <ItemStoreDrawer
        isOpen={true}
        onOpenChange={itemDrawerHandlers.close}
      />
    </AdminContext.Provider>
  );
}
