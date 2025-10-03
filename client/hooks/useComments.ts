import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { CommentService, CreateCommentRequest } from '@/services/api/commentService';
import type { CommentType } from '../../shared/types';
import { queryKeys } from '@/query/queryKeys';

/**
 * Hook pour la gestion des commentaires
 * ✅ Respecte les patterns Agentova : React Query + cache management + useCallback
 */
export function useComments(textId?: string) {
  // ✅ Context workspace obligatoire
  const { currentWorkspaceId } = useWorkspaceContext();
  const queryClient = useQueryClient();

  // ✅ React Query avec clés standardisées
  const commentsQuery = useQuery({
    queryKey: textId 
      ? queryKeys.comments.byText(currentWorkspaceId, textId)
      : queryKeys.comments.all(currentWorkspaceId),
    queryFn: () => CommentService.getComments(currentWorkspaceId, textId),
    staleTime: 0,
    refetchOnMount: true,
    placeholderData: (previousData) => previousData
  });

  // ✅ Mutation création avec gestion cache
  const createMutation = useMutation({
    mutationFn: (data: CreateCommentRequest) => 
      CommentService.createComment(currentWorkspaceId, data),
    onSuccess: (newComment) => {
      // Invalider les queries concernées pour refetch
      if (textId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.byText(currentWorkspaceId, textId)
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(currentWorkspaceId)
      });
    }
  });

  // ✅ Mutation suppression avec gestion cache
  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => 
      CommentService.deleteComment(currentWorkspaceId, commentId),
    onSuccess: () => {
      // Invalider les queries concernées pour refetch
      if (textId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.byText(currentWorkspaceId, textId)
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.all(currentWorkspaceId)
      });
    }
  });

  // ✅ Fonctions utilitaires avec useCallback
  const createComment = useCallback((data: CreateCommentRequest) => {
    createMutation.mutate(data);
  }, [createMutation]);

  const deleteComment = useCallback((commentId: string) => {
    deleteMutation.mutate(commentId);
  }, [deleteMutation]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: textId 
        ? queryKeys.comments.byText(currentWorkspaceId, textId)
        : queryKeys.comments.all(currentWorkspaceId)
    });
  }, [currentWorkspaceId, textId, queryClient]);

  // ✅ Return organisé par catégorie
  return {
    // Data
    comments: commentsQuery.data || [],
    // Loading states
    isLoading: commentsQuery.isLoading,
    isRefetching: commentsQuery.isRefetching,
    isError: commentsQuery.isError,
    error: commentsQuery.error,
    // Actions
    createComment,
    deleteComment,
    // Action states
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    // Utils
    refresh
  };
}

