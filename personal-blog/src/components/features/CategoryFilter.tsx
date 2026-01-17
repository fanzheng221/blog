import { Button } from '@/components/ui/button'
import type { Category } from '@/lib/api'
import { categoriesApi } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export function CategoryFilter() {
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const currentCategory = searchParams.get('category')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const response = await categoriesApi.getAll()
      setCategories(response.categories)
    } catch (error) {
      console.error('Failed to load categories:', error)
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">加载分类中...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant={currentCategory === null ? 'default' : 'outline'} size="sm">
        <Link to="/articles">全部</Link>
      </Button>

      {categories.map((category) => (
        <Button
          key={category.id}
          asChild
          variant={currentCategory === category.slug ? 'default' : 'outline'}
          size="sm"
        >
          <Link to={`/articles?category=${category.slug}`}>{category.name}</Link>
        </Button>
      ))}
    </div>
  )
}
