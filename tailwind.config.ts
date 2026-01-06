import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './App.tsx', './index.tsx', './components/**/*.{ts,tsx}', './context/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}', './services/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Oswald', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      colors: {
        'brand-accent': '#FFC300',
      },
    },
  },
  plugins: [],
} satisfies Config;
