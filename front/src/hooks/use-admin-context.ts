import { createContext, useContext } from "react";

type AdminContextType = {
  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
  onMonsterDrawerOpenChange: () => void;
  setMonsterWeapon: (
    monsterWeapon: { id: number; name: string } | null
  ) => void;
  setMonsterItem: (monsterItem: { id: number; name: string } | null) => void;
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
