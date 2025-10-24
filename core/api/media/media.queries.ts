import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { MediaType } from '@prisma/client';

interface MediaFilters {
  type?: MediaType;
  limit?: number;
}

export function useMedia(filters: MediaFilters = {}) {
  return useQuery({
    queryKey: ['media', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.limit) params.append('limit', filters.limit.toString());

      return apiClient.get(`/media?${params.toString()}`);
    },
  });
}

export function useInfiniteMedia(filters: MediaFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['media', 'infinite', filters],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (pageParam) params.append('cursor', pageParam as string);

      return apiClient.get<any[]>(`/media?${params.toString()}`);
    },
    getNextPageParam: (lastPage) => {
      if (!Array.isArray(lastPage) || lastPage.length === 0) return undefined;
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.id;
    },
    initialPageParam: undefined as string | undefined,
  });
}

export function useMediaById(id: string) {
  return useQuery({
    queryKey: ['media', id],
    queryFn: () => apiClient.get(`/media/${id}`),
    enabled: !!id,
  });
}
