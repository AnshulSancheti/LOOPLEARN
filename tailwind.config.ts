import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:    { DEFAULT: '#0a0a0b', soft: '#111113', card: '#121216' },
        text:  { DEFAULT: '#e6e6e6', dim:  '#a3a3a3' },
        accent:{ DEFAULT: 'var(--accent)' },
        border: '#1f1f25',
      },
      boxShadow: { soft: '0 2px 16px rgba(0,0,0,0.35)' },
      borderRadius: { '2xl': '1rem' },
    },
  },
  plugins: [],
}
export default config
