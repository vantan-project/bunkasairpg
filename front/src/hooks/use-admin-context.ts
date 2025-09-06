import { createContext, useContext } from "react";

type AdminContextType = {
  isMonsterDrawerOpen: boolean;
  onMonsterDrawerOpenChange: () => void;
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
  setFilterChildren: (filterChildren: React.ReactNode) => void;
  setPaginationContent: (paginationContent: React.ReactNode) => void;
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
