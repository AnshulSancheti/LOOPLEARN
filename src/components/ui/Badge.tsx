// src/components/ui/Badge.tsx
import * as React from 'react'
export function Badge({ className = '', ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`badge ${className}`} {...props} />
}