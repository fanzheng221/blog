import express from 'express';
import type { Router } from 'express';
import { generateArticle } from '../services/ai.service.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router:Router = express.Router();

// 所有 AI 路由需要认证和管理员权限
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * POST /api/ai/generate-article
 * 使用 AI 生成文章
 */
router.post('/generate-article', async (req, res) => {
  try {
    const { topic, style, length, keywords } = req.body;

    // 验证必填字段
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({
        error: '请提供文章主题',
      });
    }

    // 验证 style 参数
    const validStyles = ['formal', 'casual', 'technical'];
    const selectedStyle = validStyles.includes(style) ? style : 'technical';

    // 验证 length 参数
    const validLengths = ['short', 'medium', 'long'];
    const selectedLength = validLengths.includes(length) ? length : 'medium';

    // 验证 keywords 参数
    const validKeywords = Array.isArray(keywords)
      ? keywords.filter((k) => typeof k === 'string' && k.trim())
      : [];

    // 调用 AI 服务生成文章
    const generatedArticle = await generateArticle({
      topic,
      style: selectedStyle,
      length: selectedLength,
      keywords: validKeywords,
    });

    res.json({
      success: true,
      data: generatedArticle,
    });
  } catch (error: any) {
    console.error('AI 文章生成错误:', error);
    res.status(500).json({
      error: error.message || 'AI 文章生成失败，请稍后重试',
    });
  }
});

/**
 * GET /api/ai/status
 * 检查 AI 服务状态
 */
router.get('/status', (req, res) => {
  const apiKey = process.env.ZHIPUAI_API_KEY;

  res.json({
    enabled: !!apiKey,
    provider: 'Zhipu AI (GLM)',
    model: 'glm-4-flash',
  });
});

export default router;
