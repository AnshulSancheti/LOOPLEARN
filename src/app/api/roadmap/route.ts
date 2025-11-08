import { NextResponse } from 'next/server'
import { RoadmapSchema } from '@/lib/types'
import { extractJson } from '@/lib/json'
import { MOCK_ROADMAP } from '@/lib/mock'
import { buildPrompt } from '@/lib/prompts'

const API_KEY = (process.env.GEMINI_API_KEY || '').trim()
const RAW_MODEL = (process.env.GEMINI_MODEL || 'models/gemini-2.5-flash').trim()

/** Accepts both “gemini-2.5-flash” and “models/gemini-2.5-flash” */
const asPath = (m: string) => (m.startsWith('models/') ? m : `models/${m}`)

function getTextFromCandidates(data: any): string {
  const parts = data?.candidates?.[0]?.content?.parts
  if (Array.isArray(parts)) {
    const t = parts.map((p: any) => p?.text ?? '').filter(Boolean).join('\n')
    if (t) return t
  }
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

/**
 * Minimal REST payload that is supported by your v1 models.
 * (No systemInstruction/responseMimeType/responseSchema here.)
 */
async function callGemini(prompt: string, ver: 'v1' | 'v1beta', model: string) {
  const modelPath = asPath(model)
  const url = `https://generativelanguage.googleapis.com/${ver}/${modelPath}:generateContent?key=${API_KEY}`

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text:
              // keep the strong “JSON only” instruction up front
              'You must reply with ONLY raw JSON. No prose, no code fences, no markdown.\n\n' +
              prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  }

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  const raw = await r.text()
  if (!r.ok) {
    const err = new Error(`gemini_${ver}_${r.status}`)
    ;(err as any).status = r.status
    ;(err as any).body = raw
    throw err
  }

  let data: any
  try {
    data = JSON.parse(raw)
  } catch {
    const err = new Error('gemini_json_parse_fail')
    ;(err as any).status = 500
    ;(err as any).body = raw
    throw err
  }

  const text = getTextFromCandidates(data)
  return { text, data, ver, modelPath }
}

export async function POST(req: Request) {
  const { topic, answers } = await req.json().catch(() => ({}))
  if (!topic) return NextResponse.json({ error: 'missing_topic' }, { status: 400 })

  const DEBUG = new URL(req.url).searchParams.get('debug') === '1'
  const send = (roadmap: any, dbg?: any) =>
    NextResponse.json(DEBUG ? { roadmap, debug: dbg || {} } : roadmap)

  // No key → keep app usable with mock
  if (!API_KEY) {
    return send(RoadmapSchema.parse(MOCK_ROADMAP), { mode: 'mock' })
  }

  const prompt = buildPrompt(topic, answers || {})

  // Try your verified model first on v1, then safe alternates.
  const attempts = [
    { ver: 'v1' as const, model: RAW_MODEL },
    { ver: 'v1' as const, model: 'models/gemini-2.5-pro' },
    { ver: 'v1beta' as const, model: RAW_MODEL },
    { ver: 'v1beta' as const, model: 'models/gemini-2.5-pro' },
  ]

  for (const a of attempts) {
    try {
      const { text, data, ver, modelPath } = await callGemini(prompt, a.ver, a.model)
      console.log('[roadmap] using', ver, modelPath)

      // Be defensive: try direct JSON first, else extract first JSON block.
      let obj: any
      try {
        obj = JSON.parse(text)
      } catch {
        obj = extractJson(text)
      }

      const roadmap = RoadmapSchema.parse(obj)
      return send(roadmap, { mode: 'gemini', apiVersion: ver, model: modelPath, rawText: text, raw: data })
    } catch (e: any) {
      const status = e?.status
      console.warn('[roadmap] attempt failed:', a.ver, a.model, status, (e?.body || '').slice?.(0, 200))
      // keep trying for model/route mismatches, bail on auth/quotas
      if (status && ![400, 404, 405].includes(status)) break
    }
  }

  console.error('[roadmap] all attempts failed — serving mock fallback')
  return send(RoadmapSchema.parse(MOCK_ROADMAP), { mode: 'fallback' })
}
