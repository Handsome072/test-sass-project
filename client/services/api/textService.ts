import { callSecuredFunction } from '@/services/local/authenticationService';
import type { TextType } from '../../../shared/types';

/**
 * Service de gestion des textes côté client
 * ✅ Respecte les patterns Agentova : méthodes statiques + callSecuredFunction
 */

export interface CreateTextRequest {
  title?: string;
  content: string;
}

export interface TextsResponse {
  texts: TextType[];
}

export interface TextResponse {
  text: TextType;
}

export class TextService {
  /**
   * Créer un nouveau texte
   * ✅ Méthode statique + workspaceId en premier paramètre
   */
  static async createText(
    workspaceId: string,
    data: CreateTextRequest
  ): Promise<TextType> {
    try {
      const response = await callSecuredFunction<TextResponse>(
        'createText',
        workspaceId,
        {
          content: data.content,
          title: data.title
        }
      );
      return response.text;
    } catch (error) {
      console.error('Erreur création texte:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les textes d'un workspace
   * ✅ Méthode statique + workspaceId en premier paramètre
   */
  static async getTexts(workspaceId: string): Promise<TextType[]> {
    try {
      const response = await callSecuredFunction<TextsResponse>(
        'getTexts',
        workspaceId
      );
      return response.texts;
    } catch (error) {
      console.error('Erreur récupération textes:', error);
      throw error;
    }
  }

  /**
   * Supprimer un texte
   * ✅ Méthode statique + workspaceId en premier paramètre
   */
  static async deleteText(
    workspaceId: string,
    textId: string
  ): Promise<boolean> {
    try {
      const response = await callSecuredFunction<{ deleted: boolean }>(
        'deleteText',
        workspaceId,
        { textId }
      );
      return response.deleted;
    } catch (error) {
      console.error('Erreur suppression texte:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un texte
   * ✅ Méthode statique + workspaceId en premier paramètre
   */
  static async updateText(
    workspaceId: string,
    textId: string,
    data: Partial<CreateTextRequest>
  ): Promise<TextType> {
    try {
      const response = await callSecuredFunction<TextResponse>(
        'updateText',
        workspaceId,
        {
          textId,
          ...data
        }
      );
      return response.text;
    } catch (error) {
      console.error('Erreur mise à jour texte:', error);
      throw error;
    }
  }
}
