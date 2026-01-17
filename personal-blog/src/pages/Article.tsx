import { CommentSection } from '@/components/features/CommentSection'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useTitle } from '@/hooks/useTitle'
import type { Article } from '@/lib/api'
import { articlesApi } from '@/lib/api'
import { ArrowLeft, Calendar, Clock, Loader2, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, Navigate, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

export function Article() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useTitle(article?.title)

  useEffect(() => {
    if (slug) {
      loadArticle(slug)
    }
  }, [slug])

  const loadArticle = async (articleSlug: string) => {
    setIsLoading(true)
    setError(false)
    try {
      const data = await articlesApi.getBySlug(articleSlug)
      setArticle(data)
    } catch (err) {
      console.error('Failed to load article:', err)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !article) {
    return <Navigate to="/articles" replace />
  }

  return (
    <div className="min-h-screen pt-24">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/articles"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回文章列表
        </Link>

        {/* Article header */}
        <header className="mb-8">
          {article.category && (
            <Badge className="mb-4 bg-primary text-primary-foreground">
              {article.category.name}
            </Badge>
          )}

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
          )}

          {/* Article meta */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={article.author?.avatar || ''} />
                <AvatarFallback>
                  {article.author?.username?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">
                {article.author?.username || 'Admin'}
              </span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.created_at}>
                {new Date(article.created_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.view_count || 0} 次浏览</span>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Cover image */}
        {article.cover_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img src={article.cover_image} alt={article.title} className="w-full h-auto" />
          </div>
        )}

        {/* Article content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>

        <Separator className="my-12" />

        {/* Comments */}
        <CommentSection articleSlug={article.slug} />
      </article>
    </div>
  )
}
