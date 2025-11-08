'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { useRoadmapStore } from '@/store/roadmapStore'

type Level = 'beginner' | 'intermediate' | 'advanced'
type Time = '1h' | '5h' | '10h'
type Style = 'video' | 'article' | 'mixed'

export default function OnboardingPage() {
  const router = useRouter()
  const { topic, setAnswers, setRoadmap, answers } = useRoadmapStore()

  // local state defaults from store.answers if present
  const [level, setLevel] = useState<Level>((answers.level as Level) || 'beginner')
  const [time, setTime] = useState<Time>((answers.time as Time) || '5h')
  const [style, setStyle] = useState<Style>((answers.style as Style) || 'mixed')
  const [loading, setLoading] = useState(false)

  // guard: if user hits /onboarding directly with no topic, send them home
  useEffect(() => {
    if (!topic) router.replace('/')
  }, [topic, router])

  const submit = async () => {
    try {
      setLoading(true)
      const a = { level, time, style }
      setAnswers(a)

      const res = await fetch('/api/roadmap?debug=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, answers: a }),
      })

      const data = await res.json().catch(() => ({} as any))
      setLoading(false)

      if (!res.ok) {
        alert(data?.error || 'Failed to create roadmap')
        return
      }

      // Supports both shapes: {roadmap, debug} or plain roadmap
      const roadmap = data.roadmap ?? data
      const rawText: string | null = data?.debug?.rawText ?? null

      setRoadmap(roadmap)
      // persist raw model output without changing the store
      if (typeof window !== 'undefined' && rawText) {
        localStorage.setItem('last-raw', rawText)
      }

      router.push('/roadmap')
    } catch (e: any) {
      setLoading(false)
      alert(e?.message || 'Something went wrong')
    }
  }

  return (
    <main>
      <Header />
      <section className="container">
        <Card className="grid gap-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="btn-ghost">Back</button>
            <h2 className="text-lg font-semibold">Onboarding</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="label">Current level</label>
              <Select className="mt-2" value={level} onChange={e => setLevel(e.target.value as Level)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </div>

            <div>
              <label className="label">Time per week</label>
              <Select className="mt-2" value={time} onChange={e => setTime(e.target.value as Time)}>
                <option value="1h">~1–2h</option>
                <option value="5h">~3–6h</option>
                <option value="10h">7h+</option>
              </Select>
            </div>

            <div>
              <label className="label">Learning style</label>
              <Select className="mt-2" value={style} onChange={e => setStyle(e.target.value as Style)}>
                <option value="video">Mostly video</option>
                <option value="article">Mostly reading</option>
                <option value="mixed">Mixed</option>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <button onClick={submit} className="btn-accent" disabled={loading || !topic}>
              {loading ? 'Generating…' : 'Generate roadmap'}
            </button>
            <span className="label">Topic: {topic || '—'}</span>
          </div>
        </Card>
      </section>
    </main>
  )
}
