// src/components/ui/Select.tsx
'use client'
import * as React from 'react'
export function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`input ${className}`} {...props}>
      {children}
    </select>
  )
}