import { Badge } from '@/components/ui/Badge'
import { ResourceLink } from './ResourceLink'

export function ModuleCard({ m, index, done, onToggle }: { m: any; index: number; done: boolean; onToggle: (id: string) => void }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            aria-label={done ? 'Mark incomplete' : 'Mark complete'}
            onClick={() => onToggle(m.id)}
            className={`h-6 w-6 grid place-items-center rounded border border-border ${done ? 'bg-[var(--accent)] text-black' : 'bg-bg-soft text-text'}`}
            title={done ? 'Completed' : 'Mark complete'}
          >
            {done ? '✓' : ''}
          </button>
          <span className="h-7 w-7 grid place-items-center rounded-full bg-[var(--accent)] text-black font-bold">{index + 1}</span>
          <h3 className={`text-lg font-semibold ${done ? 'line-through text-text-dim' : ''}`}>{m.title}</h3>
        </div>
        <Badge>~{m.duration_hours ?? 1}h</Badge>
      </div>
      {m.summary && <p className={`mt-2 ${done ? 'text-text-dim/60' : 'text-text-dim'}`}>{m.summary}</p>}
      <ul className="mt-4 grid gap-2">
        {(m.resources || []).map((r: any, i: number) => <ResourceLink key={i} r={r} />)}
      </ul>
    </div>
  )
}