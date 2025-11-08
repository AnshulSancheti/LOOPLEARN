import { ModuleCard } from './ModuleCard'

export function RoadmapView({
  roadmap,
  done,
  onToggle,
  onExport,
  onShowRaw,
}: {
  roadmap: any
  done: Record<string, boolean>
  onToggle: (id: string) => void
  onExport?: () => void
  onShowRaw?: () => void
}) {
  const total = roadmap.modules.length
  const completed = roadmap.modules.filter((m: any) => done?.[m.id]).length
  const percent = Math.round((completed / Math.max(total, 1)) * 100)

  return (
    <section className="container grid gap-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold">Roadmap: {roadmap.topic}</h2>
          <p className="text-text-dim">Level: {roadmap.level} · {total} modules</p>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          {onShowRaw && <button className="btn-ghost" onClick={onShowRaw}>Show raw</button>}
          {onExport && <button className="btn-ghost" onClick={onExport}>Export JSON</button>}
          <a className="btn-ghost" href="/">Start over</a>
        </div>
      </header>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-dim">Progress</span>
          <span className="text-sm">{completed}/{total} · {percent}%</span>
        </div>
        <div className="h-2 rounded bg-[#1a1a20] overflow-hidden">
          <div className="h-2 bg-[var(--accent)]" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ol className="grid gap-4">
        {roadmap.modules.map((m: any, idx: number) => (
          <li key={m.id}>
            <ModuleCard m={m} index={idx} done={!!done?.[m.id]} onToggle={onToggle} />
          </li>
        ))}
      </ol>
    </section>
  )
}
