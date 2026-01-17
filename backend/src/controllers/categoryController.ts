import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../models/category.js';
import type { Request, Response } from 'express';

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await getAllCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createCategoryHandler(req: Request, res: Response) {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const category = await createCategory(name, slug);
    res.json(category);
  } catch (error: any) {
    console.error('Create category error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

export async function updateCategoryHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const category = await updateCategory(id, name, slug);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error: any) {
    console.error('Update category error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

export async function deleteCategoryHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const deleted = await deleteCategory(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Delete category error:', error);
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
}
