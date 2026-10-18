import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LinkInsert, LinkUpdate } from "../@types/database.types";
import {
  getAnalyticsSummary,
  getActiveLinks,
  getAllLinks,
  getBusinessInfo,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  saveBusinessInfo,
  type SaveBusinessInfoInput,
} from "../services";

export const QUERY_KEYS = {
  activeLinks: ["links", "active"] as const,
  allLinks: ["links", "all"] as const,
  businessInfo: ["business_info"] as const,
  analytics: ["analytics_summary"] as const,
};

export function useActiveLinks() {
  return useQuery({
    queryKey: QUERY_KEYS.activeLinks,
    queryFn: getActiveLinks,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAllLinks() {
  return useQuery({
    queryKey: QUERY_KEYS.allLinks,
    queryFn: getAllLinks,
  });
}

export function useBusinessInfo() {
  return useQuery({
    queryKey: QUERY_KEYS.businessInfo,
    queryFn: getBusinessInfo,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.analytics,
    queryFn: getAnalyticsSummary,
  });
}

export function useLinkMutations() {
  const queryClient = useQueryClient();

  const invalidateLinks = () => {
    queryClient.invalidateQueries({ queryKey: ["links"] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: LinkInsert) => createLink(payload),
    onSuccess: invalidateLinks,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: LinkUpdate }) =>
      updateLink(id, updates),
    onSuccess: invalidateLinks,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLink(id),
    onSuccess: invalidateLinks,
  });

  const reorderMutation = useMutation({
    mutationFn: (items: Array<{ id: string; position: number }>) =>
      reorderLinks(items),
    onSuccess: invalidateLinks,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    reorderMutation,
  };
}

export function useSaveBusinessInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveBusinessInfoInput) => saveBusinessInfo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.businessInfo });
    },
  });
}
