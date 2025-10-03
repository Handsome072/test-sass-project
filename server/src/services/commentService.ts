import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { validateAuth, verifyWorkspaceToken, isValidWorkspaceToken } from '../utils/authWorkspace.js';
import { validateRequiredFields, isSuccess, handleError } from '../utils/validation.js';
import { createResponseWithTokens } from '../../shared/responses.js';
import { getCommentRepository } from '../../db/repositories/index.js';
import { WORKSPACE_ROLES } from '../../../shared/types.js';

/**
 * Service de gestion des commentaires
 * ✅ Respecte les patterns Agentova : validation cascade + repository pattern
 */

/**
 * Créer un nouveau commentaire
 */
export const createComment = onCall({
  memory: '512MiB',
  timeoutSeconds: 60
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, text_id, content, author } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'text_id', 'content', 'author'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR // Rôle requis pour créer des commentaires
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 4. Validation métier spécifique
    if (content.length > 500) {
      return response.error({
        code: 'INVALID_INPUT',
        message: 'Le commentaire ne peut pas dépasser 500 caractères'
      });
    }

    if (author.length > 100) {
      return response.error({
        code: 'INVALID_INPUT',
        message: 'Le nom de l\'auteur ne peut pas dépasser 100 caractères'
      });
    }

    // ✅ 5. Logique métier via repository
    const commentData = {
      text_id: text_id.trim(),
      content: content.trim(),
      author: author.trim(),
      created_by: uid
    };
    
    const newComment = await getCommentRepository().create(workspace_id, commentData);

    // ✅ 6. Logging succès
    logger.info(`Commentaire créé avec succès pour workspace ${workspace_id} par ${uid}`);

    // ✅ 7. Réponse standardisée
    return response.success({ comment: newComment });
    
  } catch (error) {
    logger.error(`Erreur dans createComment:`, error);
    return handleError(error);
  }
});

/**
 * Récupérer tous les commentaires d'un workspace
 */
export const getComments = onCall({
  memory: '512MiB',
  timeoutSeconds: 60
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, text_id } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR // Rôle requis pour lire les commentaires
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 5. Logique métier via repository
    let comments;
    if (text_id) {
      // Récupérer les commentaires d'un texte spécifique
      comments = await getCommentRepository().getByText(workspace_id, text_id);
    } else {
      // Récupérer tous les commentaires du workspace
      comments = await getCommentRepository().getByWorkspace(workspace_id);
    }

    // ✅ 6. Logging succès
    logger.info(`Commentaires récupérés pour workspace ${workspace_id} par ${uid}`);

    // ✅ 7. Réponse standardisée
    return response.success({ comments });
    
  } catch (error) {
    logger.error(`Erreur dans getComments:`, error);
    return handleError(error);
  }
});

/**
 * Supprimer un commentaire
 */
export const deleteComment = onCall({
  memory: '512MiB',
  timeoutSeconds: 60
}, async (request) => {
  try {
    // ✅ 1. Validation auth OBLIGATOIRE
    const authResponse = validateAuth(request.auth);
    if (!isSuccess(authResponse)) return authResponse;
    const uid = authResponse.user;

    // ✅ 2. Extraction et validation params
    const { workspaceToken, commentId } = request.data;
    const validationResponse = validateRequiredFields(request.data, [
      'workspaceToken', 'commentId'
    ]);
    if (!isSuccess(validationResponse)) return validationResponse;

    // ✅ 3. Validation workspace + rôles
    const tokenValidation = await verifyWorkspaceToken(
      workspaceToken, 
      uid, 
      WORKSPACE_ROLES.EDITOR // Rôle requis pour supprimer des commentaires
    );
    const validationResult = isValidWorkspaceToken(tokenValidation);
    if (!isSuccess(validationResult)) return validationResult;
    const { workspace_id, workspace_tokens } = validationResult;
    const response = createResponseWithTokens(workspace_tokens);

    // ✅ 5. Logique métier via repository
    const deleted = await getCommentRepository().delete(commentId, workspace_id);
    
    if (!deleted) {
      return response.error({
        code: 'NOT_FOUND',
        message: 'Commentaire non trouvé'
      });
    }

    // ✅ 6. Logging succès
    logger.info(`Commentaire ${commentId} supprimé pour workspace ${workspace_id} par ${uid}`);

    // ✅ 7. Réponse standardisée
    return response.success({ deleted: true });
    
  } catch (error) {
    logger.error(`Erreur dans deleteComment:`, error);
    return handleError(error);
  }
});

