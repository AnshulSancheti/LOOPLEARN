import { z } from 'zod'

export const ResourceSchema = z.object({
  type: z.enum(['video','article','exercise','project','github']).optional().default('article'),
  title: z.string(),
  url: z.string().url(),
  estimated_minutes: z.coerce.number().int().positive().optional(),   // ← coerce
})

export const ModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string().optional().default(''),
  duration_hours: z.coerce.number().positive().optional().default(1), // ← coerce
  resources: z.array(ResourceSchema).min(1),
})

export const RoadmapSchema = z.object({
  topic: z.string(),
  level: z.enum(['beginner','intermediate','advanced']).optional().default('beginner'),
  modules: z.array(ModuleSchema).min(1),
})

export type TRoadmap = z.infer<typeof RoadmapSchema>
export type TModule = z.infer<typeof ModuleSchema>
export type TResource = z.infer<typeof ResourceSchema>
