import type { TRoadmap } from './types'

export const MOCK_ROADMAP: TRoadmap = {
  topic: 'Linear Algebra for ML',
  level: 'beginner',
  modules: [
    {
      id: 'm1',
      title: 'Vectors & Matrices',
      summary: 'Geometric intuition of vectors, matrices, and norms.',
      duration_hours: 2,
      resources: [
        { type: 'video', title: '3Blue1Brown – Essence of LA (Ep 1)', url: 'https://www.youtube.com/watch?v=fNk_zzaMoSs' },
        { type: 'exercise', title: 'Khan – Vectors practice', url: 'https://www.khanacademy.org/math/linear-algebra' }
      ]
    },
    {
      id: 'm2',
      title: 'Matrix Multiplication & Transformations',
      summary: 'Transformations, composition, determinant intuition.',
      duration_hours: 2,
      resources: [
        { type: 'video', title: '3Blue1Brown – Matrix mult', url: 'https://www.youtube.com/watch?v=XkY2DOUCWMU' },
        { type: 'project', title: 'Implement 2D transforms', url: 'https://github.com/yourorg/la-transforms-starter' }
      ]
    },
  ]
}