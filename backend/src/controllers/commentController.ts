import {
  createComment,
  getCommentsByArticleSlug,
  deleteComment,
  getCommentById,
} from '../models/comment.js';
import { getArticleBySlug } from '../models/article.js';
import type { Request, Response } from 'express';
import type { CreateCommentData } from '../types/index.js';

export async function getComments(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const comments = await getCommentsByArticleSlug(slug);

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createCommentHandler(req: any, res: Response) {
  try {
    const { slug } = req.params;
    const { content, parent_id }: CreateCommentData = req.body;
    const authorId = req.user.id;

    // Validate article exists
    const article = await getArticleBySlug(slug);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const comment = await createComment(
      { content: content.trim(), parent_id },
      article.id,
      authorId
    );

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteCommentHandler(req: any, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get comment to check ownership
    const targetComment = await getCommentById(id);

    if (!targetComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is author or admin
    if (targetComment.author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    const success = await deleteComment(id);

    if (!success) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
