import { createContext, useContext } from "react";

type AdminContextType = {
  monsterDrawerOpened: boolean;
  monsterDrawerOpen: () => void;
  monsterDrawerClose: () => void;
  monsterWeapon: {
    id: number;
    name: string;
  } | null;
  setMonsterWeapon: (
    monsterWeapon: { id: number; name: string } | null
  ) => void;
  monsterItem: {
    id: number;
    name: string;
  } | null;
  setMonsterItem: (monsterItem: { id: number; name: string } | null) => void;
  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
};

export const AdminContext = createContext<AdminContextType | undefined>(
  undefined
);

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error(
      "useAdminContext must be used within a AdminContextProvider"
    );
  }
  return context;
}
