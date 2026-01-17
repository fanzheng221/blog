import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Article } from '@/types'
import { ArrowRight, Calendar, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'featured' | 'compact'
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <Link to={`/articles/${article.slug}`}>
      <Card
        className={cn(
          'group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full',
          isFeatured && 'md:col-span-2 lg:col-span-3'
        )}
      >
        {article.cover_image && (
          <div className="relative overflow-hidden">
            <img
              src={article.cover_image}
              alt={article.title}
              className={cn(
                'w-full object-cover transition-transform duration-500 group-hover:scale-105',
                isFeatured ? 'h-64 md:h-80' : 'h-48'
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          </div>
        )}

        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {article.category && (
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {article.category.name}
              </Badge>
            )}
            {article.featured && (
              <Badge variant="outline" className="border-primary text-primary">
                精选
              </Badge>
            )}
            {article.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <h3
            className={cn(
              'font-display font-bold leading-tight group-hover:text-primary transition-colors',
              isFeatured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
            )}
          >
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className={cn(isFeatured && 'text-lg')}>
          <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3">
            {article.author && (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={article.author.avatar || undefined} alt={article.author.username} />
                  <AvatarFallback>{article.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{article.author.username}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
            {article.view_count && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{article.view_count}</span>
              </div>
            )}
          </div>

          <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
        </CardFooter>
      </Card>
    </Link>
  )
}
