import { RoadmapSchema, type TRoadmap } from './types'

const ALLOWED = ['video','article','exercise','project','github'] as const
type RType = typeof ALLOWED[number]

function normalize(obj: any) {
  const topic = String(obj?.topic ?? obj?.title ?? 'Untitled')
  const lv = String(obj?.level ?? obj?.difficulty ?? '').toLowerCase()
  const level: 'beginner'|'intermediate'|'advanced' =
    (['beginner','intermediate','advanced'] as const).includes(lv as any) ? (lv as any) : 'beginner'

  const src = Array.isArray(obj?.modules) ? obj.modules
           : Array.isArray(obj?.steps) ? obj.steps
           : Array.isArray(obj?.items) ? obj.items
           : []

  const modules = src.map((m: any, i: number) => {
    const id = String(m?.id ?? m?.key ?? `m${i+1}`)
    const title = String(m?.title ?? m?.name ?? `Module ${i+1}`)
    const summary = String(m?.summary ?? m?.description ?? '')
    const dh = Number(m?.duration_hours ?? m?.hours ?? m?.duration ?? (m?.estimated_minutes ? Number(m.estimated_minutes)/60 : 1))
    const duration_hours = Number.isFinite(dh) && dh > 0 ? dh : 1

    const links = Array.isArray(m?.resources) ? m.resources
               : Array.isArray(m?.links) ? m.links
               : []

    const resources = links.map((r: any) => {
      const url = String(r?.url ?? r?.link ?? r?.href ?? '')
      if (!/^https?:\/\//i.test(url)) return null

      let type = String(r?.type ?? '').toLowerCase() as RType
      if (!ALLOWED.includes(type)) {
        if (url.includes('youtube') || url.includes('youtu.be') || url.endsWith('.mp4')) type = 'video'
        else if (url.includes('github.com')) type = 'github'
        else type = 'article'
      }
      const title = String(r?.title ?? r?.name ?? url)
      const minutes = r?.estimated_minutes ?? r?.minutes
      const estimated_minutes = minutes !== undefined ? Number(minutes) : undefined
      return { type, title, url, estimated_minutes }
    }).filter(Boolean)

    return { id, title, summary, duration_hours, resources }
  }).filter((m: any) => (m.resources?.length ?? 0) > 0)

  return { topic, level, modules }
}

export function extractJson(text: string): TRoadmap {
  // try raw JSON
  try { return RoadmapSchema.parse(JSON.parse(text)) } catch {}

  // fenced blocks
  const fence = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```([\s\S]*?)```/)
  if (fence) {
    try { return RoadmapSchema.parse(normalize(JSON.parse(fence[1] ?? fence[0].replace(/```json|```/gi,'')))) } catch {}
  }

  // widest object
  const s1 = text.indexOf('{'), e1 = text.lastIndexOf('}')
  if (s1 >= 0 && e1 > s1) {
    try { return RoadmapSchema.parse(normalize(JSON.parse(text.slice(s1, e1+1)))) } catch {}
  }
  // widest array
  const s2 = text.indexOf('['), e2 = text.lastIndexOf(']')
  if (s2 >= 0 && e2 > s2) {
    try { return RoadmapSchema.parse(normalize(JSON.parse(text.slice(s2, e2+1)))) } catch {}
  }

  throw new Error('Invalid roadmap JSON from model')
}
