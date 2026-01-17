import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, FileText, FolderOpen, Home, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()

  // 根据当前路径决定回退目标
  const getBackLink = (pathname: string) => {
    // 文章编辑或创建页面
    if (pathname.match(/^\/admin\/articles\/(new|[\w-]+)$/)) {
      return '/admin/articles'
    }
    // 其他管理页面返回首页
    return '/'
  }

  const getUserInitials = () => {
    if (!user?.username) return 'U'
    return user.username.slice(0, 2).toUpperCase()
  }

  const adminNav = [
    { name: '文章管理', href: '/admin/articles', icon: FileText },
    { name: '分类管理', href: '/admin/categories', icon: FolderOpen },
  ]

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo and Back */}
            <div className="flex items-center gap-4">
              <Link to={getBackLink(location.pathname)}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold">技术笔记</span>
                <span className="text-primary">.</span>
                <span className="text-sm text-muted-foreground ml-2">管理后台</span>
              </div>
            </div>

            {/* Center: Admin Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {adminNav.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-stone-100 dark:bg-stone-800 text-foreground'
                        : 'text-muted-foreground hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Right: User Menu */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      <p className="text-xs leading-none text-primary mt-1">管理员</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/" className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      返回首页
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white dark:bg-stone-900 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-serif font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  )
}
