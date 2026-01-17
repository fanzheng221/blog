import { ArticleCard } from '@/components/features/ArticleCard'
import { Hero } from '@/components/features/Hero'
import { Button } from '@/components/ui/button'
import type { Article } from '@/lib/api'
import { articlesApi } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [recentArticles, setRecentArticles] = useState<Article[]>([])

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const response = await articlesApi.getAll()
      const allArticles = response.articles

      const featured = allArticles.filter((a) => a.featured)
      const recent = allArticles.filter((a) => !a.featured).slice(0, 3)

      setFeaturedArticles(featured)
      setRecentArticles(recent)
    } catch (error) {
      console.error('Failed to load articles:', error)
      setFeaturedArticles([])
      setRecentArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-bold">精选文章</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ArticleCard article={article} variant="featured" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Articles */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold">最新文章</h2>
            <Button variant="outline" asChild>
              <Link to="/articles">查看全部</Link>
            </Button>
          </div>

          {recentArticles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">暂无文章</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
