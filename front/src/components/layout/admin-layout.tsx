import { useRouter } from "next/navigation";
import { MonsterStoreDrawerButton } from "../feature/admin/monster-store-drawar-button";
import { useEffect } from "react";
import { ItemStoreDrawerButton } from "../feature/admin/item-store-drawar-button";
import { WeaponStoreDrawerButton } from "../feature/admin/weapon-store-drawar-button";
import { MantineNavLink } from "../shared/mantine/mantine-nav-link";
import { MonsterIcon } from "../shared/icons/monster-icon";
import { WeaponIcon } from "../shared/icons/weapon-icon";
import { ItemIcon } from "../shared/icons/item-icon";
import { ListIcon } from "../shared/icons/list-icon";

type Props = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    document.body.style.backgroundColor = "var(--color-black)";
  }, []);

  return (
    <div className="pl-64 pr-4 pt-4">
      <header className="w-56 flex flex-col gap-4 text-black fixed top-0 left-0 z-20 m-4">
        <div className="bg-white p-2 rounded-2xl shadow-lg shadow-violet-400">
          <h1 className="text-lg font-bold pl-2">メニュー</h1>

          <MantineNavLink label="モンスター管理" leftSection={<MonsterIcon />}>
            <MantineNavLink
              onClick={() => router.push("/admin/monster")}
              label="モンスター一覧"
              leftSection={<ListIcon />}
            />
            <MonsterStoreDrawerButton />
          </MantineNavLink>
          <MantineNavLink label="武器管理" leftSection={<WeaponIcon />}>
            <MantineNavLink
              onClick={() => router.push("/admin/weapon")}
              label="武器一覧"
              leftSection={<ListIcon />}
            />
            <WeaponStoreDrawerButton />
          </MantineNavLink>
          <MantineNavLink label="アイテム管理" leftSection={<ItemIcon />}>
            <MantineNavLink
              onClick={() => router.push("/admin/item")}
              label="アイテム一覧"
              leftSection={<ListIcon />}
            />
            <ItemStoreDrawerButton />
          </MantineNavLink>
        </div>
      </header>
      {children}
    </div>
  );
}
