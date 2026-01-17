import { ArticleCard } from '@/components/features/ArticleCard'
import { CategoryFilter } from '@/components/features/CategoryFilter'
import { Input } from '@/components/ui/input'
import type { Article } from '@/lib/api'
import { articlesApi } from '@/lib/api'
import { Loader2, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export function Articles() {
  const [searchParams] = useSearchParams()
  const categorySlug = searchParams.get('category')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    loadArticles()
  }, [categorySlug])

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const response = await articlesApi.getAll({
        category: categorySlug || undefined,
      })
      setArticles(response.articles)
    } catch (error) {
      console.error('Failed to load articles:', error)
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) {
      return articles
    }

    const query = searchQuery.toLowerCase()
    return articles.filter((article) => {
      return (
        article.title.toLowerCase().includes(query) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(query)) ||
        (article.tags && article.tags.some((tag) => tag.toLowerCase().includes(query)))
      )
    })
  }, [articles, searchQuery])

  return (
    <div className="min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">文章</h1>
          <p className="text-xl text-muted-foreground">探索关于设计、开发和技术的一些想法。</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <CategoryFilter />

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6 text-muted-foreground">找到 {filteredArticles.length} 篇文章</div>

            {/* Articles grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <div
                    key={article.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">
                  {categorySlug || searchQuery ? '没有找到符合条件的文章。' : '暂无文章'}
                </p>
                {(categorySlug || searchQuery) && (
                  <Link
                    to="/articles"
                    onClick={() => setSearchQuery('')}
                    className="text-primary hover:underline"
                  >
                    清除筛选
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
