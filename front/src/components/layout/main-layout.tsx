"use client";

import { MeIndexResponse, meIndex } from "@/api/me-index";
import { MeItemResponse, meItem } from "@/api/me-item";
import { MeWeaponResponse, meWeapon } from "@/api/me-weapon";
import { GlobalContext } from "@/hooks/use-global-context";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingScreen } from "./loading-screen";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  const pathname = usePathname();
  const allowedPaths = ["/admin", "/login"];
  if (
    pathname === "/" ||
    allowedPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    return (
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        {children}
      </HeroUIProvider>
    );
  }

  const [user, setUser] = useState<MeIndexResponse & { maxHitPoint: number }>();
  const [weapons, setWeapons] = useState<MeWeaponResponse>();
  const [items, setItems] = useState<MeItemResponse>();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          meIndex().then((user) => {
            if (user) setUser({ ...user, maxHitPoint: user.hitPoint });
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
        router.push("/?notLoggedIn=1");
      }
    };

    fetchData();
  }, []);

  if (!user || !weapons || !items) {
    return <LoadingScreen />;
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
