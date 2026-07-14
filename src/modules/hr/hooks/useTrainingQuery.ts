import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trainingApi } from "../api/training.api";


export const HR_TRAINING_KEYS = {
  COURSES: ["training_courses"],
  WARNINGS: ["training_warnings"],
  HISTORY: (staffId: string) => ["training_history", staffId]
};

export const useAllCourses = () => {
  return useQuery({
    queryKey: HR_TRAINING_KEYS.COURSES,
    queryFn: trainingApi.getAllCourses
  });
};

export const useCertificateWarnings = () => {
  return useQuery({
    queryKey: HR_TRAINING_KEYS.WARNINGS,
    queryFn: trainingApi.getWarnings
  });
};

export const useStaffTrainingHistory = (staffId: string) => {
  return useQuery({
    queryKey: HR_TRAINING_KEYS.HISTORY(staffId),
    queryFn: () => trainingApi.getStaffHistory(staffId),
    enabled: !!staffId
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: trainingApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_TRAINING_KEYS.COURSES });
    }
  });
};

export const useEnrollParticipant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: trainingApi.enroll,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: HR_TRAINING_KEYS.HISTORY(variables.staffId) });
      queryClient.invalidateQueries({ queryKey: HR_TRAINING_KEYS.COURSES });
    }
  });
};
