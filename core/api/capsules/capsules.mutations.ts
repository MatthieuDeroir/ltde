import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

interface CreateCapsuleData {
  title: string;
  content?: string;
  tagIds?: string[];
  status?: 'DRAFT' | 'PUBLISHED';
}

interface UpdateCapsuleData {
  title?: string;
  content?: string;
  tagIds?: string[];
  status?: 'DRAFT' | 'PUBLISHED';
}

export function useCreateCapsule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCapsuleData) => {
      return apiClient.post('/capsules', data);
    },
    onSuccess: () => {
      // Invalidate capsules list to refetch
      queryClient.invalidateQueries({ queryKey: ['capsules'] });
    },
  });
}

export function useUpdateCapsule(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCapsuleData) => {
      return apiClient.put(`/capsules/${id}`, data);
    },
    onSuccess: () => {
      // Invalidate both the specific capsule and the capsules list
      queryClient.invalidateQueries({ queryKey: ['capsule', id] });
      queryClient.invalidateQueries({ queryKey: ['capsules'] });
    },
  });
}

export function useDeleteCapsule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/capsules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capsules'] });
    },
  });
}
