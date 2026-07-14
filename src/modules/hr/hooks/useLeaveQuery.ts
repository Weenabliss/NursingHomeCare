import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveApi } from "../api/leave.api";
import type { LeaveRequest } from "../types";

export const HR_LEAVE_KEYS = {
  ALL: ["leave_all"],
  LIST: (staffId: string) => ["leave", staffId],
  BALANCE: (staffId: string, year: number) => ["leave_balance", staffId, year]
};

export const useAllLeaves = () => {
  return useQuery({
    queryKey: HR_LEAVE_KEYS.ALL,
    queryFn: leaveApi.getAll
  });
};

export const useLeaveByStaff = (staffId: string) => {
  return useQuery({
    queryKey: HR_LEAVE_KEYS.LIST(staffId),
    queryFn: () => leaveApi.getByStaffId(staffId),
    enabled: !!staffId
  });
};

export const useLeaveBalance = (staffId: string, year: number) => {
  return useQuery({
    queryKey: HR_LEAVE_KEYS.BALANCE(staffId, year),
    queryFn: () => leaveApi.getBalance(staffId, year),
    enabled: !!staffId && !!year
  });
};

export const useCreateLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: leaveApi.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: HR_LEAVE_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: HR_LEAVE_KEYS.LIST(variables.staffId) });
    }
  });
};

export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: LeaveRequest["status"]; approverId?: string; rejectReason?: string } }) => leaveApi.updateStatus(id, data),
    onSuccess: () => {
      // Vì không có staffId trong arguments của mutation, nên ta invalidate ALL
      queryClient.invalidateQueries({ queryKey: HR_LEAVE_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: ["leave"] });
    }
  });
};
