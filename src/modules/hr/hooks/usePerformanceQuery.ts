import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { performanceApi } from "../api/performance.api";


export const HR_PERFORMANCE_KEYS = {
  REVIEWS: (staffId: string) => ["performance_reviews", staffId],
  INCIDENTS: (staffId: string) => ["medical_incidents", staffId]
};

export const useStaffReviews = (staffId: string) => {
  return useQuery({
    queryKey: HR_PERFORMANCE_KEYS.REVIEWS(staffId),
    queryFn: () => performanceApi.getReviews(staffId),
    enabled: !!staffId
  });
};

export const useStaffIncidents = (staffId: string) => {
  return useQuery({
    queryKey: HR_PERFORMANCE_KEYS.INCIDENTS(staffId),
    queryFn: () => performanceApi.getIncidents(staffId),
    enabled: !!staffId
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: performanceApi.createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: HR_PERFORMANCE_KEYS.REVIEWS(variables.staffId) });
    }
  });
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: performanceApi.createIncident,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: HR_PERFORMANCE_KEYS.INCIDENTS(variables.staffId) });
    }
  });
};
