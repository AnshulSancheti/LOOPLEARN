'use client'
import Header from '@/components/Header'
import { RoadmapView } from '@/components/Roadmap/RoadmapView'
import { useRoadmapStore } from '@/store/roadmapStore'
import { useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function RoadmapPage() {
  const { roadmap, setRoadmap } = useRoadmapStore()
  const [rawText, setRawText] = useState<string | null>(null)
  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    if (!roadmap && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('last-roadmap')
        if (raw) setRoadmap(JSON.parse(raw))
      } catch {}
    }
    if (typeof window !== 'undefined' && rawText == null) {
      const r = localStorage.getItem('last-raw')
      if (r) setRawText(r)
    }
  }, [roadmap, setRoadmap, rawText])

  const storageKey = useMemo(
    () => (roadmap ? `done:${roadmap.topic}` : 'done:__nope__'),
    [roadmap]
  )
  const [done, setDone] = useLocalStorage<Record<string, boolean>>(storageKey, {})
  const onToggle = (id: string) => setDone(prev => ({ ...prev, [id]: !prev?.[id] }))

  const onExport = () => {
    if (!roadmap) return
    const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roadmap-${slugify(roadmap.topic)}.json`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <main>
      <Header />
      {!roadmap ? (
        <section className="container">
          <div className="card p-6">No roadmap yet. <a className="link" href="/">Create one</a>.</div>
        </section>
      ) : (
        <>
          {showRaw && rawText && (
            <section className="container">
              <div className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-dim">Raw model output</span>
                  <button className="btn-ghost" onClick={() => setShowRaw(false)}>Close</button>
                </div>
                <pre className="whitespace-pre-wrap break-words text-xs max-h-80 overflow-auto">{rawText}</pre>
              </div>
            </section>
          )}

          <RoadmapView
            roadmap={roadmap}
            done={done}
            onToggle={onToggle}
            onExport={onExport}
            onShowRaw={() => setShowRaw(v => !v)}
          />
        </>
      )}
    </main>
  )
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}
