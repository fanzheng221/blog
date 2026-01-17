import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { aiApi } from '@/lib/api'
import type { AxiosError } from 'axios'
import { Loader2, Sparkles, Wand2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface AIArticleGeneratorProps {
  onGenerated: (data: {
    title: string
    content: string
    excerpt: string
    tags: string[]
    cover_image?: string
    category?: string
  }) => void
  onClose?: () => void
}

export function AIArticleGenerator({ onGenerated, onClose }: AIArticleGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState<'formal' | 'casual' | 'technical'>('technical')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [keywords, setKeywords] = useState('')
  const [keywordList, setKeywordList] = useState<string[]>([])

  const handleAddKeyword = () => {
    const trimmed = keywords.trim()
    if (trimmed && !keywordList.includes(trimmed)) {
      setKeywordList([...keywordList, trimmed])
      setKeywords('')
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setKeywordList(keywordList.filter((k) => k !== keyword))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('请输入文章主题')
      return
    }

    setIsGenerating(true)
    try {
      const result = await aiApi.generateArticle({
        topic: topic.trim(),
        style,
        length,
        keywords: keywordList,
      })

      toast.success('文章生成成功！')
      onGenerated(result)
      handleClose()
    } catch (error) {
      console.error('AI 生成失败:', error)
      const errorMessage =
        (error as AxiosError<{ error: string }>).response?.data?.error ||
        'AI 文章生成失败，请稍后重试'
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setTopic('')
    setStyle('technical')
    setLength('medium')
    setKeywordList([])
    setKeywords('')
    onClose?.()
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full border-dashed"
        size="lg"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        使用 AI 生成文章
      </Button>
    )
  }

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI 文章生成器</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>使用智谱 AI 快速生成博客文章内容</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 主题输入 */}
        <div className="space-y-2">
          <Label htmlFor="topic">
            文章主题 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="topic"
            placeholder="例如：React 18 的新特性介绍"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        {/* 风格选择 */}
        <div className="space-y-2">
          <Label>写作风格</Label>
          <Select
            value={style}
            onValueChange={(value: typeof style) => setStyle(value)}
            disabled={isGenerating}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">正式学术风格</SelectItem>
              <SelectItem value="casual">轻松口语风格</SelectItem>
              <SelectItem value="technical">技术专业风格</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 长度选择 */}
        <div className="space-y-2">
          <Label>内容深度</Label>
          <Select
            value={length}
            onValueChange={(value: typeof length) => setLength(value)}
            disabled={isGenerating}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">简洁精炼</SelectItem>
              <SelectItem value="medium">内容充实</SelectItem>
              <SelectItem value="long">深入全面</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 关键词 */}
        <div className="space-y-2">
          <Label htmlFor="keywords">关键词（可选）</Label>
          <div className="flex gap-2">
            <Input
              id="keywords"
              placeholder="输入关键词后按回车"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddKeyword}
              disabled={isGenerating}
            >
              添加
            </Button>
          </div>
          {keywordList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {keywordList.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveKeyword(keyword)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 生成按钮 */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              AI 正在生成中...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              生成文章
            </>
          )}
        </Button>

        {/* 提示信息 */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p>
            提示：AI
            会自动生成完整内容，不会因字数限制截断。生成的文章内容可以直接编辑修改，建议在发布前仔细检查和调整。
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
