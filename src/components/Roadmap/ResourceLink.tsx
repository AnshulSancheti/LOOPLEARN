// src/components/Roadmap/ResourceLink.tsx
import { Badge } from '@/components/ui/Badge'
export function ResourceLink({ r }: { r: { type?: string; title: string; url: string; estimated_minutes?: number } }) {
  return (
    <li className="flex items-center gap-3">
      <Badge className="capitalize">{r.type || 'link'}</Badge>
      <a className="link" href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
      {r.estimated_minutes && <span className="text-text-dim text-xs">· {r.estimated_minutes}m</span>}
    </li>
  )
}