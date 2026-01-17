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
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import type { Category } from '@/lib/api'
import { categoriesApi } from '@/lib/api'
import { Edit, FolderOpen, Loader2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function CategoryManagement() {
  useTitle('分类管理')
  const { isAdmin } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  })

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
      toast.error('加载分类失败')
    } finally {
      setIsLoading(false)
    }
  }

  const openCreateDialog = () => {
    setEditingCategory(null)
    setFormData({ name: '', slug: '' })
    setIsDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, slug: category.slug })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('请输入分类名称')
      return
    }
    if (!formData.slug.trim()) {
      toast.error('请输入分类别名')
      return
    }

    setIsSaving(true)
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, formData)
        toast.success('分类更新成功')
      } else {
        await categoriesApi.create(formData)
        toast.success('分类创建成功')
      }
      setIsDialogOpen(false)
      loadCategories()
    } catch (error: any) {
      console.error('Failed to save category:', error)
      const errorMessage = error.response?.data?.error || '保存失败，请稍后重试'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.category) return

    setIsDeleting(true)
    try {
      await categoriesApi.delete(deleteDialog.category.id)
      toast.success('分类删除成功')
      setDeleteDialog({ open: false, category: null })
      loadCategories()
    } catch (error: any) {
      console.error('Failed to delete category:', error)
      const errorMessage = error.response?.data?.error || '删除失败，请稍后重试'
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (value: string) => {
    const slug = editingCategory ? formData.slug : generateSlug(value)
    setFormData({ name: value, slug })
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AdminRoute>
      <AdminLayout title="分类管理" subtitle="管理文章分类">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">共 {categories.length} 个分类</p>
            <Button onClick={openCreateDialog} className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              新建分类
            </Button>
          </div>

          {/* Categories Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">暂无分类</h3>
                  <p className="text-muted-foreground mb-4">开始创建你的第一个分类吧</p>
                  <Button
                    onClick={openCreateDialog}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    新建分类
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名称</TableHead>
                      <TableHead>别名</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(category.created_at).toLocaleDateString('zh-CN')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteDialog({ open: true, category })}
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

        {/* Create/Edit Dialog */}
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{editingCategory ? '编辑分类' : '新建分类'}</AlertDialogTitle>
              <AlertDialogDescription>
                {editingCategory ? '修改分类信息' : '创建新的文章分类'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">分类名称</Label>
                <Input
                  id="name"
                  placeholder="例如：JavaScript 基础篇"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">别名</Label>
                <Input
                  id="slug"
                  placeholder="例如：javascript"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  用于 URL 中的标识符，只能包含字母、数字、连字符和下划线
                </p>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSaving}>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  '保存'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, category: null })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除分类</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除分类 "{deleteDialog.category?.name}" 吗？此操作无法撤销。
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
