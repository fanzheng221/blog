import {
  createArticle,
  getArticleById,
  getArticleByIdWithDetails,
  getArticleBySlug,
  getAllArticles,
  updateArticle,
  deleteArticle,
  incrementViewCount,
} from '../models/article.js';
import type { Request, Response } from 'express';
import type { CreateArticleData, UpdateArticleData } from '../types/index.js';

export async function getArticles(req: Request, res: Response) {
  try {
    const { category, featured, limit, offset, status } = req.query;
    // 检查是否是 /articles/all 路由（管理员获取所有文章）
    const isGetAllRoute = req.path.endsWith('/all');

    const articles = await getAllArticles({
      category: category as string | undefined,
      featured: featured === 'true',
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      status: status as 'draft' | 'published' | 'scheduled' | undefined,
      allStatuses: isGetAllRoute ? true : undefined,
    });

    res.json({ articles, count: articles.length });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getArticleBySlugHandler(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    await incrementViewCount(article.id);

    res.json(article);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getArticleByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const article = await getArticleByIdWithDetails(id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Get article by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createArticleHandler(req: any, res: Response) {
  try {
    const data: CreateArticleData = req.body;
    const authorId = req.user.id;

    if (!data.title || !data.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
      const article = await createArticle(data, authorId);
      res.status(201).json(article);
    } catch (error: any) {
      // 处理 slug 唯一性冲突
      if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
        // 检查是否是 slug 冲突
        if (error.message?.includes('slug') || error.message?.includes('articles_slug_key')) {
          // 生成唯一的 slug
          const originalSlug = data.slug || '';
          if (originalSlug) {
            const timestamp = Date.now().toString(36);
            data.slug = `${originalSlug}-${timestamp}`;

            // 重试创建
            const article = await createArticle(data, authorId);
            res.status(201).json(article);
            return;
          }
        }
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Create article error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

export async function updateArticleHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data: UpdateArticleData = req.body;

    try {
      const article = await updateArticle(id, data);

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.json(article);
    } catch (error: any) {
      // 处理 slug 唯一性冲突
      if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
        // 检查是否是 slug 冲突
        if (error.message?.includes('slug') || error.message?.includes('articles_slug_key')) {
          const originalSlug = data.slug || '';
          if (originalSlug) {
            const timestamp = Date.now().toString(36);
            data.slug = `${originalSlug}-${timestamp}`;

            // 重试更新
            const article = await updateArticle(id, data);
            if (article) {
              res.json(article);
              return;
            }
          }
        }
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Update article error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

export async function deleteArticleHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const success = await deleteArticle(id);

    if (!success) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
