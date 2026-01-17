import { Logo } from '@/components/layout/Logo'
import { useTheme } from '@/components/providers/ThemeProvider'
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
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { FileText, LogIn, LogOut, Menu, Moon, Search, Sun, UserPlus, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navigation = [
  { name: '首页', href: '/' },
  { name: '文章', href: '/articles' },
  { name: '关于', href: '/about' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 在路由变化时重置导航状态
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    setSearchQuery('')
  }, [location.pathname])
  /* eslint-enable react-hooks/set-state-in-effect */

  const getUserInitials = () => {
    if (!user?.username) return 'U'
    return user.username.slice(0, 2).toUpperCase()
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/articles?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
    }
  }

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value)
    if (location.pathname === '/articles') {
      const url = new URLSearchParams(window.location.search)
      if (value.trim()) {
        url.set('search', value.trim())
      } else {
        url.delete('search')
      }
      const newUrl = `/articles${url.toString() ? `?${url.toString()}` : ''}`
      navigate(newUrl, { replace: true })
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary relative',
                  location.pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin/articles"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary relative',
                  location.pathname.startsWith('/admin')
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                管理后台
                {location.pathname.startsWith('/admin') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:block">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fade-in">
                  <Input
                    type="search"
                    placeholder="搜索文章..."
                    className="w-64 h-9"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false)
                      setSearchQuery('')
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
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
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/articles" className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" />
                          文章管理
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    登录
                  </Link>
                </Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" asChild>
                  <Link to="/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    注册
                  </Link>
                </Button>
              </>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-in-right">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索文章..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
              />
            </form>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'block py-2 text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin/articles"
                className={cn(
                  'block py-2 text-sm font-medium transition-colors',
                  location.pathname.startsWith('/admin')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                管理后台
              </Link>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
