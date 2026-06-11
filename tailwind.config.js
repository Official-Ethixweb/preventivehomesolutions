/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        phsBlue: '#1a9bf0',
        phsOrange: '#f3741b',
        phsOrangeDark: '#e35e0a',
        phsNavy: '#0a2540',
        phsLink: '#2f6fdb',
        phsCream: '#f4ecdf',
        phsInk: '#16263d',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'Arial', 'sans-serif'],
        display: ['Archivo', 'system-ui', 'Arial', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
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
      },
      animation: {
        marquee: 'marquee 18s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 40s linear infinite',
        'slide-down': 'slide-down 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
