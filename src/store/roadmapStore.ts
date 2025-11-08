'use client'
import { create } from 'zustand'
import type { TRoadmap } from '@/lib/types'

interface RoadmapState {
  topic: string
  answers: Record<string, any>
  roadmap: TRoadmap | null
  rawText: string | null
  setTopic: (t: string) => void
  setAnswers: (a: Record<string, any>) => void
  setRoadmap: (r: TRoadmap | null) => void
  setRawText: (s: string | null) => void
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
  topic: '',
  answers: {},
  roadmap: null,
  rawText: null,
  setTopic: (t) => set({ topic: t }),
  setAnswers: (a) => set({ answers: a }),
  setRoadmap: (r) => {
    if (typeof window !== 'undefined' && r) {
      localStorage.setItem('last-roadmap', JSON.stringify(r))
    }
    set({ roadmap: r })
  },
  setRawText: (s) => {
    if (typeof window !== 'undefined' && s != null) {
      localStorage.setItem('last-raw', s)
    }
    set({ rawText: s })
  },
}))
