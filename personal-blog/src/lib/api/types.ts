// API Types

export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'user'
  avatar?: string | null
  bio?: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface ArticleAuthor {
  id: string
  username: string
  avatar?: string | null
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  cover_image?: string | null
  category_id?: string | null
  category?: Category
  author_id: string
  author?: ArticleAuthor
  featured?: boolean
  view_count?: number
  tags?: string[]
  status: 'draft' | 'published' | 'scheduled'
  published_at?: string | null
  created_at: string
  updated_at: string
}

export interface CommentAuthor {
  id: string
  username: string
  avatar?: string | null
}

export interface Comment {
  id: string
  article_id: string
  author_id: string
  author?: CommentAuthor
  content: string
  parent_id?: string | null
  replies?: Comment[]
  created_at: string
  updated_at: string
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Article Create/Update Types
export interface CreateArticleRequest {
  title: string
  slug?: string
  excerpt?: string
  content: string
  cover_image?: string
  category_id?: string
  tags?: string[]
  featured?: boolean
  status?: 'draft' | 'published' | 'scheduled'
  published_at?: string
}

export interface UpdateArticleRequest {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  cover_image?: string
  category_id?: string
  tags?: string[]
  featured?: boolean
  status?: 'draft' | 'published' | 'scheduled'
  published_at?: string
}

// Comment Types
export interface CreateCommentRequest {
  content: string
  parent_id?: string
}

// API Response Types
export interface ApiError {
  error: string
}

export interface ArticlesResponse {
  articles: Article[]
  count?: number
}

export interface CategoriesResponse {
  categories: Category[]
}

export interface CommentsResponse {
  comments: Comment[]
}
