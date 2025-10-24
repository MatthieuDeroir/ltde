import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => apiClient.get('/tags'),
  });
}
