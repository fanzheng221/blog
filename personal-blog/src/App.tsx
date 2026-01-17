import { MainLayout } from '@/components/layout'
import { ThemeProvider } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import {
  About,
  Article,
  ArticleEditor,
  ArticleManagement,
  Articles,
  CategoryManagement,
  Home,
  Login,
  Register,
} from '@/pages'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="blog-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="articles" element={<Articles />} />
              <Route path="articles/:slug" element={<Article />} />
              <Route path="about" element={<About />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin/articles" element={<ArticleManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/articles/new" element={<ArticleEditor />} />
            <Route path="/admin/articles/:id" element={<ArticleEditor />} />
          </Routes>
          <Toaster richColors position="top-center" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
