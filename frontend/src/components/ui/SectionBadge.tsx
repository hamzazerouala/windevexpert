import React from 'react'

interface SectionBadgeProps {
  children: React.ReactNode
  className?: string
}

export const SectionBadge: React.FC<SectionBadgeProps> = ({ children, className = '' }) => (
  <span className={`inline-block px-3 py-1 mb-4 text-xs font-mono font-bold tracking-wider text-yellow-600 dark:text-yellow-400 uppercase bg-yellow-400/10 rounded-full border border-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.1)] backdrop-blur-sm ${className}`}>
    {children}
  </span>
)