import { Link } from 'react-router-dom'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  return (
    <Link
      to="/"
      className={`font-display font-bold tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2 ${className}`}
    >
      {/* SVG Icon */}
      <svg viewBox="0 0 512 512" className={sizeClasses[size]} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="logoGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle cx="256" cy="256" r="240" fill="url(#logoGrad1)" opacity="0.1" />

        {/* Main geometric shapes */}
        <path d="M256 80 L380 280 L132 280 Z" fill="url(#logoGrad1)" opacity="0.9" />
        <path d="M132 280 L256 480 L380 280 Z" fill="url(#logoGrad2)" opacity="0.8" />

        {/* Inner elements */}
        <circle cx="256" cy="240" r="60" fill="#ffffff" opacity="0.95" />
        <circle cx="256" cy="240" r="45" fill="url(#logoGrad1)" />
        <rect x="246" y="225" width="20" height="30" rx="3" fill="#ffffff" opacity="0.9" />
        <circle cx="256" cy="265" r="5" fill="#ffffff" opacity="0.9" />

        {/* Decorative dots */}
        <circle cx="180" cy="160" r="8" fill="url(#logoGrad2)" opacity="0.7" />
        <circle cx="332" cy="160" r="8" fill="url(#logoGrad2)" opacity="0.7" />
        <circle cx="332" cy="360" r="8" fill="url(#logoGrad1)" opacity="0.7" />
        <circle cx="180" cy="360" r="8" fill="url(#logoGrad1)" opacity="0.7" />
      </svg>

      {/* Text */}
      {showText && (
        <>
          <span className={textSizeClasses[size]}>技术笔记</span>
          <span className="text-primary">.</span>
        </>
      )}
    </Link>
  )
}
