import { Logo } from '@/components/layout/Logo'
import { socialLinks } from '@/data/mock-data'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'

const iconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  mail: Mail,
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Logo size="md" className="mb-4" />
            <p className="mt-4 text-sm text-muted-foreground">
              探索想法，分享知识，记录设计与代码的旅程。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  文章
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  关于
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-display font-semibold mb-4">社交联系</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.icon as keyof typeof iconMap]
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} 技术笔记. 保留所有权利. 使用 React, TypeScript 和
            shadcn/ui 构建.
          </p>
        </div>
      </div>
    </footer>
  )
}
