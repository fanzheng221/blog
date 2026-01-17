import pool from './database.js';
import { generateId, generateSlug } from '../utils/generateId.js';
import type { Article, CreateArticleData, UpdateArticleData, ArticleWithDetails } from '../types/index.js';

export async function createArticle(data: CreateArticleData, authorId: string): Promise<Article> {
  const id = generateId();
  const slug = data.slug || generateSlug(data.title);
  const status = data.status || 'published';
  const publishedAt = data.published_at || (status === 'published' ? new Date().toISOString() : null);

  await pool.query(
    `INSERT INTO articles (id, title, slug, excerpt, content, cover_image, category_id, author_id, featured, status, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      id,
      data.title,
      slug,
      data.excerpt || null,
      data.content,
      data.cover_image || null,
      data.category_id || null,
      authorId,
      data.featured ? true : false,
      status,
      publishedAt,
    ]
  );

  // Add tags if provided
  if (data.tags && data.tags.length > 0) {
    for (const tag of data.tags) {
      await pool.query('INSERT INTO article_tags (article_id, tag) VALUES ($1, $2)', [id, tag]);
    }
  }

  const article = await getArticleById(id);
  return article!;
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
  return result.rows[0];
}

export async function getArticleByIdWithDetails(id: string): Promise<ArticleWithDetails | undefined> {
  const articleResult = await pool.query(`
    SELECT
      a.*,
      c.id as category_id,
      c.name as category_name,
      c.slug as category_slug,
      c.created_at as category_created_at,
      u.id as author_id,
      u.username as author_username,
      u.avatar as author_avatar
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.author_id = u.id
    WHERE a.id = $1
  `, [id]);

  const article = articleResult.rows[0];

  if (!article) return undefined;

  // Get tags
  const tagResult = await pool.query('SELECT tag FROM article_tags WHERE article_id = $1', [article.id]);
  const tags = tagResult.rows.map((t: any) => t.tag);

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    cover_image: article.cover_image,
    category_id: article.category_id,
    author_id: article.author_id,
    featured: article.featured,
    view_count: article.view_count,
    status: article.status,
    published_at: article.published_at,
    created_at: article.created_at,
    updated_at: article.updated_at,
    category: article.category_id ? {
      id: article.category_id,
      name: article.category_name,
      slug: article.category_slug,
      created_at: article.category_created_at,
    } : undefined,
    author: {
      id: article.author_id,
      username: article.author_username,
      avatar: article.author_avatar,
    },
    tags,
  };
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithDetails | undefined> {
  const articleResult = await pool.query(`
    SELECT
      a.*,
      c.id as category_id,
      c.name as category_name,
      c.slug as category_slug,
      c.created_at as category_created_at,
      u.id as author_id,
      u.username as author_username,
      u.avatar as author_avatar
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.author_id = u.id
    WHERE a.slug = $1
  `, [slug]);

  const article = articleResult.rows[0];

  if (!article) return undefined;

  // Get tags
  const tagResult = await pool.query('SELECT tag FROM article_tags WHERE article_id = $1', [article.id]);
  const tags = tagResult.rows.map((t: any) => t.tag);

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    cover_image: article.cover_image,
    category_id: article.category_id,
    author_id: article.author_id,
    featured: article.featured,
    view_count: article.view_count,
    status: article.status,
    published_at: article.published_at,
    created_at: article.created_at,
    updated_at: article.updated_at,
    category: article.category_id ? {
      id: article.category_id,
      name: article.category_name,
      slug: article.category_slug,
      created_at: article.category_created_at,
    } : undefined,
    author: {
      id: article.author_id,
      username: article.author_username,
      avatar: article.author_avatar,
    },
    tags,
  };
}

export async function getAllArticles(options?: { category?: string; featured?: boolean; limit?: number; offset?: number; status?: 'draft' | 'published' | 'scheduled'; allStatuses?: boolean }): Promise<ArticleWithDetails[]> {
  let query = `
    SELECT
      a.*,
      c.id as category_id,
      c.name as category_name,
      c.slug as category_slug,
      c.created_at as category_created_at,
      u.id as author_id,
      u.username as author_username,
      u.avatar as author_avatar
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.author_id = u.id
    WHERE 1=1
  `;

  const params: any[] = [];
  let paramIndex = 1;

  // Handle status filtering
  if (options?.allStatuses) {
    // When allStatuses is true, don't filter by status
  } else if (options?.status) {
    query += ` AND a.status = $${paramIndex}`;
    params.push(options.status);
    paramIndex++;
  } else {
    // Only show published articles by default
    query += ` AND a.status = 'published'`;
  }

  if (options?.category) {
    query += ` AND c.slug = $${paramIndex}`;
    params.push(options.category);
    paramIndex++;
  }

  if (options?.featured) {
    query += ` AND a.featured = true`;
  }

  query += ' ORDER BY a.created_at DESC';

  if (options?.limit) {
    query += ` LIMIT $${paramIndex}`;
    params.push(options.limit);
    paramIndex++;
  }

  if (options?.offset) {
    query += ` OFFSET $${paramIndex}`;
    params.push(options.offset);
  }

  const result = await pool.query(query, params);
  const articles: ArticleWithDetails[] = [];

  for (const article of result.rows) {
    const tagResult = await pool.query('SELECT tag FROM article_tags WHERE article_id = $1', [article.id]);
    const tags = tagResult.rows.map((t: any) => t.tag);

    articles.push({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      cover_image: article.cover_image,
      category_id: article.category_id,
      author_id: article.author_id,
      featured: article.featured,
      view_count: article.view_count,
      status: article.status,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      category: article.category_id ? {
        id: article.category_id,
        name: article.category_name,
        slug: article.category_slug,
        created_at: article.category_created_at,
      } : undefined,
      author: {
        id: article.author_id,
        username: article.author_username,
        avatar: article.author_avatar,
      },
      tags,
    });
  }

  return articles;
}

export async function updateArticle(id: string, data: UpdateArticleData): Promise<Article | undefined> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.title) {
    updates.push(`title = $${paramIndex}`);
    values.push(data.title);
    paramIndex++;
  }
  if (data.slug) {
    updates.push(`slug = $${paramIndex}`);
    values.push(data.slug);
    paramIndex++;
  }
  if (data.excerpt !== undefined) {
    updates.push(`excerpt = $${paramIndex}`);
    values.push(data.excerpt);
    paramIndex++;
  }
  if (data.content) {
    updates.push(`content = $${paramIndex}`);
    values.push(data.content);
    paramIndex++;
  }
  if (data.cover_image !== undefined) {
    updates.push(`cover_image = $${paramIndex}`);
    values.push(data.cover_image);
    paramIndex++;
  }
  if (data.category_id !== undefined) {
    updates.push(`category_id = $${paramIndex}`);
    values.push(data.category_id);
    paramIndex++;
  }
  if (data.featured !== undefined) {
    updates.push(`featured = $${paramIndex}`);
    values.push(data.featured);
    paramIndex++;
  }
  if (data.status) {
    updates.push(`status = $${paramIndex}`);
    values.push(data.status);
    paramIndex++;

    // Auto-set published_at when status is published and no published_at is provided
    if (data.status === 'published' && !data.published_at) {
      updates.push(`published_at = CURRENT_TIMESTAMP`);
    }
  }
  if (data.published_at !== undefined) {
    updates.push(`published_at = $${paramIndex}`);
    values.push(data.published_at);
    paramIndex++;
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  await pool.query(
    `UPDATE articles SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
    values
  );

  // Update tags if provided
  if (data.tags) {
    await pool.query('DELETE FROM article_tags WHERE article_id = $1', [id]);
    for (const tag of data.tags) {
      await pool.query('INSERT INTO article_tags (article_id, tag) VALUES ($1, $2)', [id, tag]);
    }
  }

  return await getArticleById(id);
}

export async function deleteArticle(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM articles WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function incrementViewCount(id: string): Promise<void> {
  await pool.query('UPDATE articles SET view_count = view_count + 1 WHERE id = $1', [id]);
}

// Publish scheduled articles that are due
export async function publishScheduledArticles(): Promise<number> {
  const result = await pool.query(`
    UPDATE articles
    SET status = 'published', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE status = 'scheduled'
    AND published_at <= CURRENT_TIMESTAMP
    RETURNING id
  `);

  return result.rowCount || 0;
}
