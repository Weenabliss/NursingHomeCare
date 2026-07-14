import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payrollApi } from "../api/payroll.api";
import type { Payslip } from "../types";

export const HR_PAYROLL_KEYS = {
  ALL: ["payroll_all"],
  LIST: (staffId: string) => ["payroll", staffId]
};

export const useAllPayroll = () => {
  return useQuery({
    queryKey: HR_PAYROLL_KEYS.ALL,
    queryFn: payrollApi.getAll
  });
};

export const usePayrollByStaff = (staffId: string) => {
  return useQuery({
    queryKey: HR_PAYROLL_KEYS.LIST(staffId),
    queryFn: () => payrollApi.getByStaffId(staffId),
    enabled: !!staffId
  });
};

export const useGeneratePayroll = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) => payrollApi.generateMonthly(month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_PAYROLL_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    }
  });
};

export const useUpdatePayrollStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Payslip["status"] }) => payrollApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_PAYROLL_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    }
  });
};
