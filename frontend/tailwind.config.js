/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#111118',
        surfaceHover: '#1a1a24',
        border: '#2a2a3a',
        primary: '#6366f1',
        primaryHover: '#4f46e5',
        textPrimary: '#f1f1f3',
        textSecondary: '#8b8b9e',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};