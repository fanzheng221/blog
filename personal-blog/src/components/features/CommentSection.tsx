import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/AuthContext'
import type { Comment } from '@/lib/api'
import { commentsApi } from '@/lib/api'
import { Loader2, LogIn, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface CommentSectionProps {
  articleSlug: string
}

export function CommentSection({ articleSlug }: CommentSectionProps) {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [articleSlug])

  const loadComments = async () => {
    setIsLoading(true)
    try {
      const response = await commentsApi.getByArticleSlug(articleSlug)
      setComments(response.comments || [])
    } catch (error) {
      console.error('Failed to load comments:', error)
      setComments([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    if (!isAuthenticated) {
      toast.error('请先登录后再发表评论')
      navigate('/login')
      return
    }

    setIsSubmitting(true)
    try {
      await commentsApi.create(articleSlug, { content: newComment })
      toast.success('评论发表成功')
      setNewComment('')
      loadComments()
    } catch (error: any) {
      console.error('Failed to submit comment:', error)
      const errorMessage = error.response?.data?.error || '发表评论失败，请稍后重试'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!isAuthenticated) return

    try {
      await commentsApi.delete(commentId)
      toast.success('评论删除成功')
      loadComments()
    } catch (error: any) {
      console.error('Failed to delete comment:', error)
      toast.error('删除评论失败')
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="font-display text-2xl font-bold">
        评论 {comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* Comment Form */}
      <Card>
        <CardContent className="pt-6">
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">发表评论</label>
                <Textarea
                  placeholder="分享你的想法..."
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">以 {user?.username} 的身份登录</p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewComment('')}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      发表中...
                    </>
                  ) : (
                    '发表评论'
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">登录后发表评论</p>
              <Button onClick={() => navigate('/login')}>
                <LogIn className="h-4 w-4 mr-2" />
                登录
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">暂无评论，来发表第一条评论吧！</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {comment.author?.username || '未知用户'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-muted-foreground">{comment.content}</p>

                    {isAuthenticated &&
                      user &&
                      (user.id === comment.author_id || user.role === 'admin') && (
                        <div className="flex gap-4 text-sm">
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
