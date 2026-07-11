import React, { createContext, useContext, useState, ReactNode } from "react";
import type { ShiftDefinition } from "../mock/shifts";
import { INITIAL_SHIFTS } from "../mock/shifts";

interface ShiftContextType {
  shifts: ShiftDefinition[];
  addShift: (shift: Omit<ShiftDefinition, "id">) => void;
  updateShift: (id: string, shift: Partial<ShiftDefinition>) => void;
  deleteShift: (id: string) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shifts, setShifts] = useState<ShiftDefinition[]>(INITIAL_SHIFTS);

  const addShift = (newShift: Omit<ShiftDefinition, "id">) => {
    const shift: ShiftDefinition = {
      ...newShift,
      id: `SHIFT-${Date.now()}`,
    };
    setShifts((prev) => [...prev, shift]);
  };

  const updateShift = (id: string, updatedFields: Partial<ShiftDefinition>) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteShift = (id: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <ShiftContext.Provider value={{ shifts, addShift, updateShift, deleteShift }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShifts = () => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error("useShifts must be used within a ShiftProvider");
  }
  return context;
};
