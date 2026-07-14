import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recruitmentApi } from "../api/recruitment.api";
import type { Candidate } from "../types";

export const HR_RECRUITMENT_KEYS = {
  CANDIDATES: ["recruitment_candidates"]
};

export const useAllCandidates = () => {
  return useQuery({
    queryKey: HR_RECRUITMENT_KEYS.CANDIDATES,
    queryFn: recruitmentApi.getAllCandidates
  });
};

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: recruitmentApi.createCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_RECRUITMENT_KEYS.CANDIDATES });
    }
  });
};

export const useUpdateCandidateStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Candidate["status"] }) => recruitmentApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HR_RECRUITMENT_KEYS.CANDIDATES });
    }
  });
};
