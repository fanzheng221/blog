import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center animate-fade-in">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-balance">
          欢迎来到{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            技术笔记
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          探索想法，分享知识，记录设计与代码的旅程。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="group text-base px-8">
            <Link to="/articles">
              <BookOpen className="mr-2 h-5 w-5" />
              最新文章
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="text-base px-8">
            <Link to="/about">
              <User className="mr-2 h-5 w-5" />
              关于我
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
