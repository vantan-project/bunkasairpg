"use client";

import { MeIndexResponse, meIndex } from "@/api/me-index";
import { MeItemResponse, meItem } from "@/api/me-item";
import { MeWeaponResponse, meWeapon } from "@/api/me-weapon";
import { GlobalContext } from "@/hooks/use-global-context";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  const pathname = usePathname();
  const allowedPaths = ["/admin", "/login", "/guide"];
  if (allowedPaths.some((path) => pathname.startsWith(path))) {
    return (
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        {children}
      </HeroUIProvider>
    );
  }

  const [user, _setUser] = useState<MeIndexResponse>();
  const setUser = (user: MeIndexResponse) => {
    _setUser(user);
  };
  const [weapons, _setWeapons] = useState<MeWeaponResponse>();
  const setWeapons = (weapons: MeWeaponResponse) => {
    _setWeapons(weapons);
  };
  const [items, _setItems] = useState<MeItemResponse>();
  const setItems = (items: MeItemResponse) => {
    _setItems(items);
  };
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          meIndex().then((user) => {
            if (user) setUser(user);
          }),
          meWeapon().then((weapons) => {
            if (weapons) setWeapons(weapons);
          }),
          meItem().then((items) => {
            if (items) setItems(items);
          }),
        ]);
      } catch (err) {
        console.warn(err);
        router.push("/guide");
      }
    };

    fetchData();
  }, []);

  if (!user || !weapons || !items) {
    return (
      <div className="h-screen flex justify-center items-center text-4xl">
        Loading...
      </div>
    );
  }

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        weapons,
        setWeapons,
        items,
        setItems,
      }}
    >
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        {children}
      </HeroUIProvider>
    </GlobalContext.Provider>
  );
}
