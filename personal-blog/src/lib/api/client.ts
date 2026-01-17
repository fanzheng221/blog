import axios, { AxiosError } from 'axios'
import type {
  ApiError,
  Article,
  ArticlesResponse,
  AuthResponse,
  CategoriesResponse,
  Comment,
  CommentsResponse,
  CreateArticleRequest,
  CreateCommentRequest,
  LoginRequest,
  RegisterRequest,
  UpdateArticleRequest,
  Category
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  getMe: async (): Promise<{ id: string; email: string; role: string }> => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  getToken: () => localStorage.getItem('auth_token'),
  getUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
}

// Articles API
export const articlesApi = {
  getAll: async (params?: {
    category?: string
    featured?: boolean
    status?: 'draft' | 'published' | 'scheduled'
  }): Promise<ArticlesResponse> => {
    const response = await apiClient.get<ArticlesResponse>('/articles', { params })
    return response.data
  },

  getAllForAdmin: async (params?: {
    category?: string
    featured?: boolean
    status?: 'draft' | 'published' | 'scheduled'
  }): Promise<ArticlesResponse> => {
    const response = await apiClient.get<ArticlesResponse>('/articles/all', { params })
    return response.data
  },

  getBySlug: async (slug: string): Promise<Article> => {
    const response = await apiClient.get<Article>(`/articles/${slug}`)
    return response.data
  },

  getById: async (id: string): Promise<Article> => {
    const response = await apiClient.get<Article>(`/articles/id/${id}`)
    return response.data
  },

  create: async (data: CreateArticleRequest): Promise<Article> => {
    const response = await apiClient.post<Article>('/articles', data)
    return response.data
  },

  update: async (id: string, data: UpdateArticleRequest): Promise<Article> => {
    const response = await apiClient.put<Article>(`/articles/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/articles/${id}`)
  },
}

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<CategoriesResponse> => {
    const response = await apiClient.get<CategoriesResponse>('/categories')
    return response.data
  },

  create: async (data: { name: string; slug: string }): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', data)
    return response.data
  },

  update: async (id: string, data: { name: string; slug: string }): Promise<Category> => {
    const response = await apiClient.put<Category>(`/categories/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`)
  },
}

// Comments API
export const commentsApi = {
  getByArticleSlug: async (slug: string): Promise<CommentsResponse> => {
    const response = await apiClient.get<CommentsResponse>(`/articles/${slug}/comments`)
    return response.data
  },

  create: async (slug: string, data: CreateCommentRequest): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/articles/${slug}/comments`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/comments/${id}`)
  },
}

// AI API
export const aiApi = {
  generateArticle: async (params: {
    topic: string
    style?: 'formal' | 'casual' | 'technical'
    length?: 'short' | 'medium' | 'long'
    keywords?: string[]
  }): Promise<{
    title: string
    content: string
    excerpt: string
    tags: string[]
    cover_image?: string
    category?: string
  }> => {
    const response = await apiClient.post('/ai/generate-article', params)
    return response.data.data
  },

  getStatus: async (): Promise<{
    enabled: boolean
    provider: string
    model: string
  }> => {
    const response = await apiClient.get('/ai/status')
    return response.data
  },
}

export default apiClient
