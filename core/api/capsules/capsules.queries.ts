import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import type { CapsuleStatus } from '@prisma/client';

export interface CapsuleFilters {
  status?: CapsuleStatus;
  tags?: string[];
  search?: string;
  limit?: number;
}

export function useCapsules(filters: CapsuleFilters = {}) {
  return useQuery({
    queryKey: ['capsules', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.tags) filters.tags.forEach((tag) => params.append('tags', tag));
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit.toString());

      return apiClient.get<{
        capsules: any[];
        nextCursor: string | null;
      }>(`/capsules?${params.toString()}`);
    },
  });
}

export function useInfiniteCapsules(filters: CapsuleFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['capsules', 'infinite', filters],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.tags) filters.tags.forEach((tag) => params.append('tags', tag));
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (pageParam) params.append('cursor', pageParam as string);

      return apiClient.get<{
        capsules: any[];
        nextCursor: string | null;
      }>(`/capsules?${params.toString()}`);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });
}

export function useCapsule(id: string) {
  return useQuery({
    queryKey: ['capsule', id],
    queryFn: () => apiClient.get(`/capsules/${id}`),
    enabled: !!id,
  });
}
