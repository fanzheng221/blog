import { AIArticleGenerator } from '@/components/features/AIArticleGenerator'
import { AdminLayout } from '@/components/layout'
import { AdminRoute } from '@/components/routes/PrivateRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import { useTitle } from '@/hooks/useTitle'
import type { Article, Category, CreateArticleRequest } from '@/lib/api'
import { articlesApi, categoriesApi } from '@/lib/api'
import type { AxiosError } from 'axios'
import { CalendarIcon, Eye, Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'

export default function ArticleEditor() {
  const { id } = useParams<{ id?: string }>()
  const articleId = id || 'new'

  useTitle(articleId === 'new' ? '新建文章' : '编辑文章')
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [previewMode, setPreviewMode] = useState(false)

  const [existingArticle, setExistingArticle] = useState<Article | null>(null)

  const [formData, setFormData] = useState<{
    title: string
    slug: string
    excerpt: string
    content: string
    cover_image: string
    categoryId: string
    tags: string // 用于输入框的字符串
    featured: boolean
    status: 'draft' | 'published' | 'scheduled'
    published_at: string
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    categoryId: '',
    tags: '',
    featured: false,
    status: 'published',
    published_at: '',
  })

  useEffect(() => {
    loadCategories()
    if (articleId && articleId !== 'new') {
      loadArticle(articleId)
    }
  }, [articleId])

  // 判断是否为编辑模式
  const isEditMode = articleId !== 'new' && existingArticle !== null

  // 判断是否可修改预约发布时间
  // 条件：是编辑模式 + 文章状态为预约发布 + 预约时间未到
  const canEditScheduleTime =
    isEditMode &&
    existingArticle?.status === 'scheduled' &&
    existingArticle?.published_at &&
    new Date(existingArticle.published_at) > new Date()

  // 禁用日期时间选择器的条件
  const disableDateTimePicker = isEditMode && !canEditScheduleTime

  // 判断预约发布按钮的显示逻辑
  const showScheduleButton = !isEditMode && formData.published_at // 新建模式 + 设置了预约时间
  const showUpdateScheduleButton = isEditMode && canEditScheduleTime && formData.published_at // 编辑模式 + 可修改预约时间 + 设置了预约时间

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      setCategories(response.categories)
    } catch (error) {
      console.error('Failed to load categories:', error)
      toast.error('加载分类失败')
    }
  }

  const loadArticle = async (articleId: string) => {
    setIsLoading(true)
    try {
      const article = await articlesApi.getById(articleId)
      setExistingArticle(article)

      // 填充表单数据
      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || '',
        content: article.content,
        cover_image: article.cover_image || '',
        categoryId: article.category_id || '',
        tags: article.tags?.join(', ') || '',
        featured: article.featured || false,
        status: article.status || 'published',
        published_at: article.published_at || '',
      })
    } catch (error) {
      console.error('Failed to load article:', error)
      toast.error('加载文章失败')
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: articleId !== 'new' ? formData.slug : generateSlug(value),
    })
  }

  const handleAIGenerated = (data: {
    title: string
    content: string
    excerpt: string
    tags: string[]
    cover_image?: string
    category?: string
  }) => {
    // 根据 category 名称查找对应的 categoryId
    const category = categories.find((c) => c.name === data.category)
    const categoryId = category?.id || ''

    setFormData({
      ...formData,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags.join(', '),
      slug: generateSlug(data.title),
      cover_image: data.cover_image || formData.cover_image,
      categoryId: categoryId || formData.categoryId,
    })
    toast.success('AI 生成内容已填充到表单')
  }

  const handleSubmit = async (action: 'publish' | 'draft') => {
    if (!formData.title.trim()) {
      toast.error('请输入文章标题')
      return
    }
    if (!formData.content.trim()) {
      toast.error('请输入文章内容')
      return
    }

    setIsSaving(true)
    try {
      let status: 'draft' | 'published' | 'scheduled' = 'published'
      let publishedAt: string | undefined = undefined

      if (action === 'draft') {
        status = 'draft'
      } else {
        // 如果设置了预约发布时间，则使用预约发布
        if (formData.published_at) {
          status = 'scheduled'
          publishedAt = formData.published_at
        } else {
          // 否则立即发布
          status = 'published'
        }
      }

      const articleData: CreateArticleRequest = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt || undefined,
        content: formData.content,
        cover_image: formData.cover_image || undefined,
        category_id: formData.categoryId || undefined,
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t)
          : [],
        featured: formData.featured,
        status,
        published_at: publishedAt,
      }

      if (articleId !== 'new' && existingArticle) {
        // 更新现有文章
        await articlesApi.update(articleId, articleData)
        const statusText =
          status === 'draft' ? '草稿保存' : status === 'scheduled' ? '预约发布' : '发布'
        toast.success(`文章${statusText}成功`)
      } else {
        // 创建新文章
        await articlesApi.create(articleData)
        const statusText =
          status === 'draft' ? '草稿保存' : status === 'scheduled' ? '预约发布' : '发布'
        toast.success(`文章${statusText}成功`)
      }
      navigate('/admin/articles')
    } catch (error) {
      console.error('Failed to save article:', error)
      const errorMessage =
        (error as AxiosError<{ error: string }>).response?.data?.error || '保存失败，请稍后重试'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  if (isLoading) {
    return (
      <AdminRoute>
        <AdminLayout title={articleId !== 'new' ? '编辑文章' : '新建文章'} subtitle="加载中...">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AdminLayout>
      </AdminRoute>
    )
  }

  return (
    <AdminRoute>
      <AdminLayout
        title={articleId !== 'new' ? '编辑文章' : '新建文章'}
        subtitle={articleId !== 'new' ? '修改现有文章内容' : '创建并发布新文章'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? '编辑' : '预览'}
            </Button>
            <div className="flex gap-2">
              <Button onClick={() => handleSubmit('draft')} disabled={isSaving} variant="outline">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    保存草稿
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleSubmit('publish')}
                disabled={isSaving}
                variant="default"
                className={
                  showScheduleButton || showUpdateScheduleButton
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : ''
                }
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditMode ? '更新中...' : '发布中...'}
                  </>
                ) : isEditMode ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    更新文章
                  </>
                ) : showScheduleButton || showUpdateScheduleButton ? (
                  <>
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    预约发布
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    立即发布
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Generator - Only show for new articles */}
              {articleId === 'new' && <AIArticleGenerator onGenerated={handleAIGenerated} />}

              <Card>
                <CardHeader>
                  <CardTitle>文章内容</CardTitle>
                  <CardDescription>填写文章的主要信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">标题 *</Label>
                    <Input
                      id="title"
                      placeholder="输入文章标题"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL 别名</Label>
                    <Input
                      id="slug"
                      placeholder="文章 URL 别名（自动生成）"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">摘要</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="简短描述文章内容（可选）"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">内容 *</Label>
                    <Textarea
                      id="content"
                      placeholder="使用 Markdown 编写文章内容..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={20}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">支持 Markdown 语法</p>
                  </div>

                  {previewMode && (
                    <div className="border rounded-lg p-6 bg-white dark:bg-stone-900">
                      <h2 className="text-2xl font-bold mb-4 font-serif">预览</h2>
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
                        {formData.excerpt && (
                          <p className="text-lg text-muted-foreground mb-4 italic">
                            {formData.excerpt}
                          </p>
                        )}
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {formData.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>文章设置</CardTitle>
                  <CardDescription>配置文章的附加信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">分类</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">标签</Label>
                    <Input
                      id="tags"
                      placeholder="用逗号分隔多个标签"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      例如: React, TypeScript, 前端开发
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverImage">封面图片 URL</Label>
                    <Input
                      id="coverImage"
                      placeholder="https://example.com/image.jpg"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    />
                    {formData.cover_image && (
                      <div className="mt-2 rounded-lg overflow-hidden border">
                        <img
                          src={formData.cover_image}
                          alt="封面预览"
                          className="w-full h-auto object-cover max-h-48"
                          onError={(e) => {
                            e.currentTarget.src = ''
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="featured" className="cursor-pointer">
                      设为精选文章
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <DateTimePicker
                      id="published_at"
                      label="预约发布时间"
                      value={formData.published_at}
                      onChange={(value) => setFormData({ ...formData, published_at: value })}
                      disabled={disableDateTimePicker}
                      minDate={new Date().toISOString()}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      {disableDateTimePicker
                        ? canEditScheduleTime === false &&
                          existingArticle?.status === 'scheduled' &&
                          existingArticle?.published_at &&
                          new Date(existingArticle.published_at) < new Date()
                          ? '预约发布时间已过期，无法修改'
                          : '编辑模式下不可修改预约发布时间'
                        : '设置后将自动在指定时间发布文章'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-stone-100 dark:bg-stone-900">
                <CardHeader>
                  <CardTitle className="text-sm">Markdown 快速参考</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-1 font-mono">
                  <p># 一级标题</p>
                  <p>## 二级标题</p>
                  <p>**粗体文本**</p>
                  <p>*斜体文本*</p>
                  <p>[链接](url)</p>
                  <p>`代码`</p>
                  <p>```代码块```</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  )
}
