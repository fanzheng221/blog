import {ZhipuAI} from 'zhipuai';
import { getAllCategories } from '../models/category.js';

// 初始化智谱 AI 客户端
const client = new ZhipuAI({
  apiKey: process.env.ZHIPUAI_API_KEY || '',
});

export interface GenerateArticleOptions {
  topic: string;
  style?: 'formal' | 'casual' | 'technical';
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
}

export interface GeneratedArticle {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  cover_image?: string;
  category?: string;
}

/**
 * 使用智谱 AI 生成文章
 */
export async function generateArticle(options: GenerateArticleOptions): Promise<GeneratedArticle> {
  const { topic, style = 'technical', length = 'medium', keywords = [] } = options;

  // 动态获取所有分类
  const categories = await getAllCategories();
  const categoryNames = categories.map(c => c.name).join('、');

  // 构建分类描述
  const categoryDescriptions = categories.map(c => {
    // 根据 slug 生成描述
    const descriptions: Record<string, string> = {
      'javascript': 'JavaScript 语言基础相关',
      'typescript': 'TypeScript 类型系统相关',
      'react': 'React 框架相关',
    };
    return `${c.name}: ${descriptions[c.slug] || '其他技术主题'}`;
  }).join('\n  - ');

  // 构建提示词
  const stylePrompts = {
    formal: '正式、专业的学术风格',
    casual: '轻松、口语化的博客风格',
    technical: '技术性强、深度分析的风格',
  };

  // 不再使用具体字数限制，改为内容深度指导
  const lengthGuidance = {
    short: '简洁精炼，重点突出核心观点',
    medium: '内容充实，有足够的技术深度和实例',
    long: '深入全面，包含完整的理论背景、实践案例和总结',
  };

  const prompt = `请根据以下要求生成一篇完整的技术博客文章：

**主题**: ${topic}
**写作风格**: ${stylePrompts[style]}
**内容深度**: ${lengthGuidance[length]}
${keywords.length > 0 ? `**关键词**: ${keywords.join(', ')}` : ''}

**重要要求**:
1. 请务必生成一篇完整的文章，不要因字数限制而截断内容
2. 文章结构清晰，包含引言、正文（多个小节）和结论
3. 内容深入浅出，适合技术博客读者
4. 使用 Markdown 格式编写
5. 添加适当的代码示例（如适用）
6. 提供实用的见解和建议

**输出格式**（请严格按此格式输出，用 === 分隔各部分）：
标题: [文章标题]
摘要: [1-2 句话的文章摘要]
分类: [从以下分类中选择最合适的一个：${categoryNames}。请根据主题判断：
  - ${categoryDescriptions}]
标签: [标签1, 标签2, 标签3]
封面图提示词: [一段描述适合作为封面图的AI绘画提示词，英文，简洁明确]
===
[文章正文内容，使用 Markdown 格式，请确保内容完整]`;

  try {
    const response = await client.chat.completions.create({
      model: 'glm-4.7',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';

    // 检查是否因长度被截断
    if (response.choices[0]?.finish_reason === 'length') {
      console.warn('AI 生成的内容因长度限制被截断，建议增加 max_tokens');
    }

    // 解析生成的文章
    return await parseGeneratedArticle(content);
  } catch (error: any) {
    console.error('智谱 AI 调用失败:', error);
    throw new Error(error.response?.data?.message || 'AI 生成文章失败');
  }
}

/**
 * 解析 AI 生成的文章内容
 */
async function parseGeneratedArticle(content: string): Promise<GeneratedArticle> {
  console.log('AI 生成的原始内容:', content);
  // 获取所有分类用于映射
  const categories = await getAllCategories();

  // 按 === 分割元数据和正文
  const parts = content.split('===');

  if (parts.length < 2) {
    // 如果格式不正确，返回默认值
    return {
      title: 'AI 生成的文章',
      content: content,
      excerpt: content.slice(0, 100) + '...',
      tags: [],
      cover_image: generateCoverImageUrl('tech blog article'),
      category: categories[0]?.name || 'JavaScript 基础篇',
    };
  }

  const metadata = parts[0].trim();
  const articleContent = parts[1].trim();

  // 解析元数据
  let title = 'AI 生成的文章';
  let excerpt = '';
  let coverImagePrompt = '';
  let category = categories[0]?.name || 'JavaScript 基础篇';
  const tags: string[] = [];

  const lines = metadata.split('\n');
  for (const line of lines) {
    if (line.startsWith('标题:')) {
      title = line.replace('标题:', '').trim();
    } else if (line.startsWith('摘要:')) {
      excerpt = line.replace('摘要:', '').trim();
    } else if (line.startsWith('标签:')) {
      const tagsStr = line.replace('标签:', '').trim();
      tags.push(...tagsStr.split(',').map((t) => t.trim()).filter((t) => t));
    } else if (line.startsWith('封面图提示词:')) {
      coverImagePrompt = line.replace('封面图提示词:', '').trim();
    } else if (line.startsWith('分类:')) {
      category = line.replace('分类:', '').trim();
    }
  }

  // 如果没有摘要，从正文中提取
  if (!excerpt) {
    excerpt = articleContent.slice(0, 150).replace(/[#*`]/g, '').trim() + '...';
  }

  // 动态构建分类映射
  const categoryMap: Record<string, string> = {};
  categories.forEach((cat) => {
    // 添加完整名称
    categoryMap[cat.name] = cat.name;
    // 添加 slug
    categoryMap[cat.slug] = cat.name;
    // 添加简短别名（如 JS、TS 等）
    if (cat.slug === 'javascript') {
      categoryMap['JS'] = cat.name;
      categoryMap['JavaScript'] = cat.name;
    } else if (cat.slug === 'typescript') {
      categoryMap['TS'] = cat.name;
      categoryMap['TypeScript'] = cat.name;
    } else if (cat.slug === 'react') {
      categoryMap['React'] = cat.name;
    }
  });

  // 查找匹配的分类
  const matchedCategory = Object.keys(categoryMap).find(key =>
    category.toLowerCase().includes(key.toLowerCase())
  );
  const finalCategory = matchedCategory ? categoryMap[matchedCategory] : (categories[0]?.name || 'JavaScript 基础篇');

  // 生成封面图 URL
  const cover_image = coverImagePrompt
    ? generateCoverImageUrl(coverImagePrompt)
    : generateCoverImageUrl('technology blog article');

  return {
    title,
    content: articleContent,
    excerpt,
    tags,
    cover_image,
    category: finalCategory,
  };
}

/**
 * 生成封面图 URL (使用 Unsplash API)
 */
function generateCoverImageUrl(prompt: string): string {
  // 使用 picsum.photos 作为稳定的图片源
  // 添加随机种子确保每次生成不同的图片
  const randomSeed = Math.floor(Math.random() * 10000);
  return `https://picsum.photos/seed/${randomSeed}/1200/630`;
}

/**
 * 流式生成文章（可选实现）
 */
export async function* generateArticleStream(
  options: GenerateArticleOptions
): AsyncGenerator<string, GeneratedArticle, unknown> {
  const { topic, style = 'technical', length = 'medium', keywords = [] } = options;

  const stylePrompts = {
    formal: '正式、专业的学术风格',
    casual: '轻松、口语化的博客风格',
    technical: '技术性强、深度分析的风格',
  };

  const lengthGuidance = {
    short: '简洁精炼',
    medium: '内容充实',
    long: '深入全面',
  };

  const prompt = `请根据以下要求生成一篇完整的技术博客文章：

主题: ${topic}
风格: ${stylePrompts[style]}
内容深度: ${lengthGuidance[length]}
${keywords.length > 0 ? `关键词: ${keywords.join(', ')}` : ''}

请生成完整内容，不要截断。使用 Markdown 格式。`;

  try {
    const stream = await client.chat.completions.create({
      model: 'glm-4.7',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: true,
    });

    let fullContent = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;
      yield content;
    }

    // 返回解析后的文章
    return parseGeneratedArticle(fullContent);
  } catch (error: any) {
    console.error('智谱 AI 流式调用失败:', error);
    throw new Error(error.response?.data?.message || 'AI 生成文章失败');
  }
}
