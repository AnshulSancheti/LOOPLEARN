'use client'
import { useRouter } from 'next/navigation'
import { useRoadmapStore } from '@/store/roadmapStore'
import Header from '@/components/Header'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

export default function Dashboard() {
  const router = useRouter()
  const topic = useRoadmapStore(s => s.topic)
  const setTopic = useRoadmapStore(s => s.setTopic)

  return (
    <main>
      <Header />
      <section className="container">
        <Card className="grid gap-6 md:grid-cols-[1fr_auto] items-center">
          <div>
            <label className="label">What do you want to learn?</label>
            <Input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g., Linear Algebra for ML" className="mt-2" />
            <p className="text-text-dim text-sm mt-2">Keep it short and specific.</p>
          </div>
          <button onClick={()=> topic.trim() && router.push('/onboarding')} className="btn-accent h-12">Continue</button>
        </Card>
      </section>
    </main>
  )
}
