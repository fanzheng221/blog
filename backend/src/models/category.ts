import pool from './database.js';
import { generateId } from '../utils/generateId.js';
import type { Category } from '../types/index.js';

export async function getAllCategories(): Promise<Category[]> {
  const result = await pool.query('SELECT * FROM categories ORDER BY name');
  return result.rows;
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0];
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const result = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
  return result.rows[0];
}

export async function createCategory(name: string, slug: string): Promise<Category> {
  const id = generateId();

  await pool.query(
    `INSERT INTO categories (id, name, slug) VALUES ($1, $2, $3)`,
    [id, name, slug]
  );

  const category = await getCategoryById(id);
  return category!;
}

export async function updateCategory(id: string, name: string, slug: string): Promise<Category | undefined> {
  await pool.query(
    `UPDATE categories SET name = $1, slug = $2 WHERE id = $3`,
    [name, slug, id]
  );

  return await getCategoryById(id);
}

export async function deleteCategory(id: string): Promise<boolean> {
  // 首先检查该分类下是否有文章
  const articlesResult = await pool.query(
    'SELECT COUNT(*) FROM articles WHERE category_id = $1',
    [id]
  );
  const articleCount = parseInt(articlesResult.rows[0].count);

  if (articleCount > 0) {
    throw new Error(`该分类下还有 ${articleCount} 篇文章，无法删除`);
  }

  const result = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
