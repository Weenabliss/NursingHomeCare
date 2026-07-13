import React, { createContext, useContext, useState } from "react";
import type { AllowanceOption } from "../constants/payroll";
import { ALLOWANCE_OPTIONS } from "../constants/payroll";

interface PayrollContextType {
  allowanceTypes: AllowanceOption[];
  addAllowanceType: (option: Omit<AllowanceOption, "id">) => void;
  updateAllowanceType: (id: string, updates: Partial<Omit<AllowanceOption, "id">>) => void;
}

const PayrollContext = createContext<PayrollContextType>({
  allowanceTypes: ALLOWANCE_OPTIONS,
  addAllowanceType: () => {},
  updateAllowanceType: () => {},
});

export const usePayroll = () => useContext(PayrollContext);

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allowanceTypes, setAllowanceTypes] = useState<AllowanceOption[]>(ALLOWANCE_OPTIONS);

  const addAllowanceType = (option: Omit<AllowanceOption, "id">) => {
    const newOption: AllowanceOption = {
      id: `CUSTOM_TYPE_${Date.now()}`,
      name: option.name,
      amount: option.amount,
    };
    setAllowanceTypes((prev) => [...prev, newOption]);
  };

  const updateAllowanceType = (id: string, updates: Partial<Omit<AllowanceOption, "id">>) => {
    setAllowanceTypes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  return (
    <PayrollContext.Provider value={{ allowanceTypes, addAllowanceType, updateAllowanceType }}>
      {children}
    </PayrollContext.Provider>
  );
};
