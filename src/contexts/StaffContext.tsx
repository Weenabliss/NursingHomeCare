import React, { createContext, useContext } from "react";
import { useStaffStore } from "../hooks/useStaffStore";
import type { Staff } from "../mock/staff";

interface StaffContextValue {
  staffList: Staff[];
  addStaff: (staff: Staff) => void;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (id: string) => void;
}

const StaffContext = createContext<StaffContextValue | null>(null);

export const StaffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useStaffStore();
  return <StaffContext.Provider value={store}>{children}</StaffContext.Provider>;
};

export const useStaffContext = (): StaffContextValue => {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaffContext must be used inside <StaffProvider>");
  return ctx;
};
