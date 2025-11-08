// src/components/ui/Card.tsx
import * as React from 'react'
export function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`card p-6 ${className}`} {...props} />
}