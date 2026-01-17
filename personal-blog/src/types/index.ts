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

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface Project {
  id: string
  title: string
  description: string
  image?: string
  url: string
  technologies: string[]
}
