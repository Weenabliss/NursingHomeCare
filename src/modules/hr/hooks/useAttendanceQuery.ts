import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "../api/attendance.api";


export const HR_ATTENDANCE_KEYS = {
  LIST: (staffId: string) => ["attendance", staffId],
  SUMMARY: (staffId: string, month: number, year: number) => ["attendance_summary", staffId, month, year]
};

export const useAttendanceByStaff = (staffId: string) => {
  return useQuery({
    queryKey: HR_ATTENDANCE_KEYS.LIST(staffId),
    queryFn: () => attendanceApi.getByStaffId(staffId),
    enabled: !!staffId
  });
};

export const useAttendanceSummary = (staffId: string, month: number, year: number) => {
  return useQuery({
    queryKey: HR_ATTENDANCE_KEYS.SUMMARY(staffId, month, year),
    queryFn: () => attendanceApi.getMonthlySummary(staffId, month, year),
    enabled: !!staffId && !!month && !!year
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: attendanceApi.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: HR_ATTENDANCE_KEYS.LIST(variables.staffId) });
      const d = new Date(variables.date);
      queryClient.invalidateQueries({ queryKey: HR_ATTENDANCE_KEYS.SUMMARY(variables.staffId, d.getMonth() + 1, d.getFullYear()) });
    }
  });
};
