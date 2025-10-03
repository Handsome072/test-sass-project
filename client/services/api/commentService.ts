import { callSecuredFunction } from '@/services/local/authenticationService';
import type { CommentType } from '../../../shared/types';

/**
 * Service de gestion des commentaires côté client
 * ✅ Respecte les patterns Agentova : méthodes statiques + callSecuredFunction
 */

export interface CreateCommentRequest {
  text_id: string;
  content: string;
  author: string;
}

export interface CommentsResponse {
  comments: CommentType[];
}

export interface CommentResponse {
  comment: CommentType;
}

export class CommentService {
  /**
   * Créer un nouveau commentaire
   * ✅ Méthode statique + workspaceId en premier paramètre
   */
  static async createComment(
    workspaceId: string,
    data: CreateCommentRequest
  ): Promise<CommentType> {
    try {
      const response = await callSecuredFunction<CommentResponse>(
        'createComment',
        workspaceId,
        {
          text_id: data.text_id,
          content: data.content,
          author: data.author
        }
      );
      return response.comment;
    } catch (error) {
      console.error('Erreur création commentaire:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les commentaires d'un workspace ou d'un texte
   * ✅ Méthode statique + workspaceId en premier paramètre
   */
  static async getComments(
    workspaceId: string,
    textId?: string
  ): Promise<CommentType[]> {
    try {
      const response = await callSecuredFunction<CommentsResponse>(
        'getComments',
        workspaceId,
        textId ? { text_id: textId } : undefined
      );
      return response.comments;
    } catch (error) {
      console.error('Erreur récupération commentaires:', error);
      throw error;
    }
  }

  /**
   * Supprimer un commentaire
   * ✅ Méthode statique + workspaceId en premier paramètre
   */
  static async deleteComment(
    workspaceId: string,
    commentId: string
  ): Promise<boolean> {
    try {
      const response = await callSecuredFunction<{ deleted: boolean }>(
        'deleteComment',
        workspaceId,
        { commentId }
      );
      return response.deleted;
    } catch (error) {
      console.error('Erreur suppression commentaire:', error);
      throw error;
    }
  }
}

