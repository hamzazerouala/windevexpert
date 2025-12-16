import React from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const { ref, className: revealClassName, style } = useScrollReveal(delay)

  return (
    <div
      ref={ref}
      className={`${revealClassName} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}