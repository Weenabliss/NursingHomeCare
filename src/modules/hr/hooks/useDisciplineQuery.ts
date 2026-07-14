import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { disciplineApi } from "../api/discipline.api";

export const HR_DISCIPLINE_KEYS = {
  RECORDS: (staffId: string) => ["discipline_records", staffId]
};

export const useStaffDiscipline = (staffId: string) => {
  return useQuery({
    queryKey: HR_DISCIPLINE_KEYS.RECORDS(staffId),
    queryFn: () => disciplineApi.getRecords(staffId),
    enabled: !!staffId
  });
};

export const useCreateDisciplineRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: disciplineApi.createRecord,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: HR_DISCIPLINE_KEYS.RECORDS(variables.staffId) });
    }
  });
};
