import { AdminLayout } from '@/components/layout'
import { AdminRoute } from '@/components/routes/PrivateRoute'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/AuthContext'
import { useTitle } from '@/hooks/useTitle'
import type { Article } from '@/lib/api'
import { articlesApi } from '@/lib/api'
import { Calendar, Edit, FileText, Loader2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function ArticleManagement() {
  useTitle('文章管理')
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [articles, setArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; article: Article | null }>({
    open: false,
    article: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const response = await articlesApi.getAllForAdmin()
      setArticles(response.articles)
    } catch (error) {
      console.error('Failed to load articles:', error)
      toast.error('加载文章失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.article) return

    setIsDeleting(true)
    try {
      await articlesApi.delete(deleteDialog.article.id)
      toast.success('文章删除成功')
      setDeleteDialog({ open: false, article: null })
      loadArticles()
    } catch (error) {
      console.error('Failed to delete article:', error)
      toast.error('删除失败，请稍后重试')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredArticles = articles.filter((article) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    return article.title.toLowerCase().includes(query) || article.slug.toLowerCase().includes(query)
  })

  if (!isAdmin) {
    return null
  }

  return (
    <AdminRoute>
      <AdminLayout title="文章管理" subtitle="管理您的所有博客文章">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="搜索文章标题或别名..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => navigate('/admin/articles/new')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              新建文章
            </Button>
          </div>

          {/* Articles Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">暂无文章</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? '没有找到匹配的文章' : '开始创建您的第一篇文章吧'}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={() => navigate('/admin/articles/new')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      新建文章
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>标题</TableHead>
                      <TableHead>别名</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>状态/精选</TableHead>
                      <TableHead>浏览</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium max-w-xs truncate">
                          {article.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {article.slug}
                        </TableCell>
                        <TableCell>
                          {article.category ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800">
                              {article.category.name}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* 状态徽章 */}
                            {article.status === 'draft' && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                草稿
                              </Badge>
                            )}
                            {article.status === 'published' && (
                              <Badge variant="default" className="bg-green-100 text-green-700">
                                已发布
                              </Badge>
                            )}
                            {article.status === 'scheduled' && article.published_at && (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(article.published_at).toLocaleDateString('zh-CN')}
                              </Badge>
                            )}
                            {article.featured && (
                              <Badge variant="secondary" className="bg-red-100 text-red-700">
                                精选
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{article.view_count || 0}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(article.created_at).toLocaleDateString('zh-CN')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/articles/${article.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteDialog({ open: true, article })}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, article: null })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除文章</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除文章 "{deleteDialog.article?.title}" 吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    删除中...
                  </>
                ) : (
                  '删除'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </AdminRoute>
  )
}
