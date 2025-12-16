import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
  className?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'default', className = '', ...props }, ref) => {
    const baseStyle = "font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
    const sizes = {
      default: "px-6 py-3 rounded-lg",
      sm: "px-4 py-2 rounded-md text-sm",
      lg: "px-8 py-4 rounded-lg text-lg",
      icon: "p-2 rounded-lg w-10 h-10"
    }
    const variants = {
      primary: "bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] transform hover:-translate-y-1 border border-transparent",
      outline: "border border-slate-300 text-slate-700 hover:border-yellow-500 hover:text-yellow-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900/50",
      ghost: "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50",
      link: "text-slate-600 hover:text-yellow-600 dark:text-slate-400 dark:hover:text-yellow-400 bg-transparent hover:bg-transparent underline-offset-4 hover:underline"
    }

    return (
      <button 
        ref={ref}
        className={cn(baseStyle, sizes[size], variants[variant], className)} 
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'