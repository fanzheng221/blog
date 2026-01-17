import pool from './database.js';
import { generateId } from '../utils/generateId.js';
import type { Comment, CreateCommentData, CommentWithDetails } from '../types/index.js';

export async function createComment(data: CreateCommentData, articleId: string, authorId: string): Promise<Comment> {
  const id = generateId();

  await pool.query(
    `INSERT INTO comments (id, article_id, author_id, content, parent_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, articleId, authorId, data.content, data.parent_id || null]
  );

  const comment = await getCommentById(id);
  return comment!;
}

export async function getCommentById(id: string): Promise<Comment | undefined> {
  const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
  return result.rows[0];
}

export async function getCommentsByArticleSlug(slug: string): Promise<CommentWithDetails[]> {
  const result = await pool.query(`
    SELECT
      c.*,
      u.id as author_id,
      u.username as author_username,
      u.avatar as author_avatar
    FROM comments c
    JOIN users u ON c.author_id = u.id
    JOIN articles a ON c.article_id = a.id
    WHERE a.slug = $1 AND c.parent_id IS NULL
    ORDER BY c.created_at DESC
  `, [slug]);

  const comments: CommentWithDetails[] = [];

  for (const comment of result.rows) {
    const replies = await getRepliesByCommentId(comment.id);
    comments.push({
      id: comment.id,
      article_id: comment.article_id,
      author_id: comment.author_id,
      content: comment.content,
      parent_id: comment.parent_id,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      author: {
        id: comment.author_id,
        username: comment.author_username,
        avatar: comment.author_avatar,
      },
      replies,
    });
  }

  return comments;
}

async function getRepliesByCommentId(parentId: string): Promise<CommentWithDetails[]> {
  const result = await pool.query(`
    SELECT
      c.*,
      u.id as author_id,
      u.username as author_username,
      u.avatar as author_avatar
    FROM comments c
    JOIN users u ON c.author_id = u.id
    WHERE c.parent_id = $1
    ORDER BY c.created_at ASC
  `, [parentId]);

  const comments: CommentWithDetails[] = [];

  for (const comment of result.rows) {
    const replies = await getRepliesByCommentId(comment.id);
    comments.push({
      id: comment.id,
      article_id: comment.article_id,
      author_id: comment.author_id,
      content: comment.content,
      parent_id: comment.parent_id,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      author: {
        id: comment.author_id,
        username: comment.author_username,
        avatar: comment.author_avatar,
      },
      replies,
    });
  }

  return comments;
}

export async function deleteComment(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function getCommentsByUserId(userId: string): Promise<Comment[]> {
  const result = await pool.query(
    'SELECT * FROM comments WHERE author_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}
