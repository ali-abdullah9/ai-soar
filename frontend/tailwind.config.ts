// tailwind.config.ts
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],  // ← make sure you’re pointing at src/
  theme: {
    extend: {
      colors: {
        'cyber-gray': '#2a2a2a',          // pick your actual hex
        'cyber-black': '#071E3D',
        'soar-dark': 'var(--soar-dark)',
        'soar-medium': 'var(--soar-medium)',
        'soar-bright': 'var(--soar-bright)',
        'soar-accent': 'var(--soar-accent)',
      },
    },
  },
  plugins: [
    forms,
    typography,
  ],
}

export default config
