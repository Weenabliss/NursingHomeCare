import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "../api/staff.api";
import type { Staff } from "../types";

export const HR_QUERY_KEYS = {
  STAFF_LIST: ["staff_list"],
  STAFF_DETAIL: (id: string) => ["staff_detail", id],
};

export const useStaffList = () => {
  return useQuery<Staff[], Error>({
    queryKey: HR_QUERY_KEYS.STAFF_LIST,
    queryFn: staffApi.getAll,
  });
};

export const useStaffDetail = (id: string | undefined) => {
  return useQuery<Staff, Error>({
    queryKey: HR_QUERY_KEYS.STAFF_DETAIL(id!),
    queryFn: () => staffApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: staffApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_QUERY_KEYS.STAFF_LIST });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Staff> }) => staffApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: HR_QUERY_KEYS.STAFF_LIST });
      queryClient.invalidateQueries({ queryKey: HR_QUERY_KEYS.STAFF_DETAIL(variables.id) });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: staffApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_QUERY_KEYS.STAFF_LIST });
    },
  });
};
