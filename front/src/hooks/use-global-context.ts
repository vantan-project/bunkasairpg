import { MeIndexResponse } from "@/api/me-index";
import { MeItemResponse } from "@/api/me-item";
import { MeWeaponResponse } from "@/api/me-weapon";
import { createContext, useContext } from "react";

type GlobalContextType = {
  user: MeIndexResponse;
  setUser: (user: MeIndexResponse) => void;
  weapons: MeWeaponResponse;
  setWeapons: (weapons: MeWeaponResponse) => void;
  items: MeItemResponse;
  setItems: (items: MeItemResponse) => void;
};

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
}
