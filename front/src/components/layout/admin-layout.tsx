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

type Props = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
  const router = useRouter();
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

  useEffect(() => {
    document.body.style.backgroundColor = "var(--color-black)";
  }, []);

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
          <h1 className="text-lg font-bold pl-2">メニュー</h1>

          <MantineNavLink label="モンスター管理" leftSection={<MonsterIcon />}>
            <MantineNavLink
              onClick={() => router.push("/admin/monster")}
              label="モンスター一覧"
              leftSection={<ListIcon />}
            />
            <MantineNavLink
              onClick={monsterDrawerHandlers.open}
              label="モンスター追加"
              leftSection={<AddIcon />}
            />
          </MantineNavLink>
          <MantineNavLink label="武器管理" leftSection={<WeaponIcon />}>
            <MantineNavLink
              onClick={() => router.push("/admin/weapon")}
              label="武器一覧"
              leftSection={<ListIcon />}
            />
            <MantineNavLink
              onClick={weaponDrawerHandlers.open}
              label="武器追加"
              leftSection={<AddIcon />}
            />
          </MantineNavLink>
          <MantineNavLink label="アイテム管理" leftSection={<ItemIcon />}>
            <MantineNavLink
              onClick={() => router.push("/admin/item")}
              label="アイテム一覧"
              leftSection={<ListIcon />}
            />
            <MantineNavLink
              onClick={itemDrawerHandlers.open}
              label="アイテム追加"
              leftSection={<AddIcon />}
            />
          </MantineNavLink>
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
        opened={itemDrawerOpened}
        close={itemDrawerHandlers.close}
      />
    </AdminContext.Provider>
  );
}
