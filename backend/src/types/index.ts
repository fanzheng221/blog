export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image?: string | null;
  category_id?: string | null;
  author_id: string;
  featured?: boolean;
  view_count?: number;
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  category_id?: string;
  featured?: boolean;
  tags?: string[];
  status?: 'draft' | 'published' | 'scheduled';
  published_at?: string;
}

export interface UpdateArticleData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  category_id?: string;
  featured?: boolean;
  tags?: string[];
  status?: 'draft' | 'published' | 'scheduled';
  published_at?: string;
}

export interface ArticleTag {
  article_id: string;
  tag: string;
}

export interface Comment {
  id: string;
  article_id: string;
  author_id: string;
  content: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentData {
  content: string;
  parent_id?: string;
}

export interface ArticleWithDetails extends Article {
  category?: Category;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  tags: string[];
}

export interface CommentWithDetails extends Comment {
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  replies?: CommentWithDetails[];
}
