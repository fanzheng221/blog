import express from 'express';
import type { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  getArticles,
  getArticleBySlugHandler,
  getArticleByIdHandler,
  createArticleHandler,
  updateArticleHandler,
  deleteArticleHandler,
} from '../controllers/articleController.js';
import {
  getComments,
  createCommentHandler,
  deleteCommentHandler,
} from '../controllers/commentController.js';
import {
  getCategories,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from '../controllers/categoryController.js';
import aiRoutes from './ai.routes.js';

const router: Router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);

// Article routes
router.get('/articles', getArticles);
router.get('/articles/all', authenticateToken, requireAdmin, getArticles);
router.get('/articles/:slug', getArticleBySlugHandler);
router.get('/articles/id/:id', authenticateToken, requireAdmin, getArticleByIdHandler);
router.post('/articles', authenticateToken, requireAdmin, createArticleHandler);
router.put('/articles/:id', authenticateToken, requireAdmin, updateArticleHandler);
router.delete('/articles/:id', authenticateToken, requireAdmin, deleteArticleHandler);

// Comment routes
router.get('/articles/:slug/comments', getComments);
router.post('/articles/:slug/comments', authenticateToken, createCommentHandler);
router.delete('/comments/:id', authenticateToken, deleteCommentHandler);

// Category routes
router.get('/categories', getCategories);
router.post('/categories', authenticateToken, requireAdmin, createCategoryHandler);
router.put('/categories/:id', authenticateToken, requireAdmin, updateCategoryHandler);
router.delete('/categories/:id', authenticateToken, requireAdmin, deleteCategoryHandler);

// AI routes
router.use('/ai', aiRoutes);

export default router;
