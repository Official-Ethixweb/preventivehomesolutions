/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        phsBlue: '#1a9bf0',
        // Darkened for WCAG AA text contrast (was #f3741b / #228CC8, which failed
        // 4.5:1 as text on light backgrounds and under white text on fills).
        phsOrange: '#d75612',
        phsOrangeDark: '#b8480d',
        phsNavy: '#0a2540',
        phsSky: '#1b6e9e',
        phsLink: '#2f6fdb',
        phsCream: '#f4ecdf',
        phsInk: '#16263d',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'Arial', 'sans-serif'],
        display: ['Strong', 'Archivo', 'system-ui', 'Arial', 'sans-serif'],
        mono: ['Strong', '"Space Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 18s linear infinite',
        'marquee-slow': 'marquee 45s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 40s linear infinite',
        'slide-down': 'slide-down 0.25s ease-out',
        'sheet-up': 'sheet-up 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
