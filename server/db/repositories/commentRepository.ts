import { Pool } from 'pg';
import { getPool } from '../config.js';
import type { CommentType, CreateCommentType } from '../../../shared/types.js';

/**
 * Repository pour la gestion des commentaires
 * ✅ Respecte les patterns Agentova : types depuis shared/types.ts + isolation workspace
 */

export class CommentRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool(); // ✅ Pool PostgreSQL
  }

  // ✅ Méthodes avec isolation workspace
  async getByWorkspace(workspaceId: string): Promise<CommentType[]> {
    const result = await this.pool.query<CommentType>(
      `SELECT id, workspace_id, text_id, content, author, created_by, created_at, updated_at 
       FROM comments 
       WHERE workspace_id = $1 
       ORDER BY created_at DESC`,
      [workspaceId] // ✅ Paramètres préparés
    );
    return result.rows;
  }

  // ✅ Récupérer les commentaires d'un texte spécifique
  async getByText(workspaceId: string, textId: string): Promise<CommentType[]> {
    const result = await this.pool.query<CommentType>(
      `SELECT id, workspace_id, text_id, content, author, created_by, created_at, updated_at 
       FROM comments 
       WHERE workspace_id = $1 AND text_id = $2 
       ORDER BY created_at DESC`,
      [workspaceId, textId]
    );
    return result.rows;
  }

  // ✅ TOUJOURS récupérer avec workspace pour sécurité
  async getById(id: string, workspaceId: string): Promise<CommentType | null> {
    const result = await this.pool.query<CommentType>(
      `SELECT id, workspace_id, text_id, content, author, created_by, created_at, updated_at 
       FROM comments 
       WHERE id = $1 AND workspace_id = $2`,
      [id, workspaceId]
    );
    return result.rows[0] || null;
  }

  async create(workspaceId: string, data: CreateCommentType): Promise<CommentType> {
    const result = await this.pool.query<CommentType>(
      `INSERT INTO comments (workspace_id, text_id, content, author, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, workspace_id, text_id, content, author, created_by, created_at, updated_at`,
      [workspaceId, data.text_id, data.content, data.author, data.created_by]
    );
    return result.rows[0];
  }

  async update(id: string, workspaceId: string, data: Partial<CreateCommentType>): Promise<CommentType | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.content !== undefined) {
      fields.push(`content = $${paramIndex++}`);
      values.push(data.content);
    }
    if (data.author !== undefined) {
      fields.push(`author = $${paramIndex++}`);
      values.push(data.author);
    }

    if (fields.length === 0) {
      return this.getById(id, workspaceId);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id, workspaceId);

    const result = await this.pool.query<CommentType>(
      `UPDATE comments 
       SET ${fields.join(', ')} 
       WHERE id = $${paramIndex++} AND workspace_id = $${paramIndex++}
       RETURNING id, workspace_id, text_id, content, author, created_by, created_at, updated_at`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string, workspaceId: string): Promise<boolean> {
    const result = await this.pool.query(
      'DELETE FROM comments WHERE id = $1 AND workspace_id = $2',
      [id, workspaceId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  async count(workspaceId: string): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      'SELECT COUNT(*) as count FROM comments WHERE workspace_id = $1',
      [workspaceId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  async countByText(workspaceId: string, textId: string): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      'SELECT COUNT(*) as count FROM comments WHERE workspace_id = $1 AND text_id = $2',
      [workspaceId, textId]
    );
    return parseInt(result.rows[0].count, 10);
  }
}

// ✅ Singleton avec lazy initialization
let commentRepo: CommentRepository | undefined;

export function getCommentRepository(): CommentRepository {
  if (!commentRepo) {
    commentRepo = new CommentRepository();
  }
  return commentRepo;
}

