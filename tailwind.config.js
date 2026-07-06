/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#FBFAF9',
        'bg-2': '#FFFFFF',
        'bg-3': '#F2EFEA',
        'fg': '#211C19',
        'fg-dim': '#6E5E57',
        'muted': '#A39A93',
        'line': 'rgba(33, 28, 25, 0.08)',
        'line-strong': 'rgba(33, 28, 25, 0.15)',
        'vermillion': '#E63946',
        'vermillion-bright': '#FF4D5A',
        'amber': '#F4A261',
        'amber-soft': '#FFD8A8',
        'oxblood': '#C1121F',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Space Grotesk', 'sans-serif'],
        syne: ['Syne', 'sans-serif']
      }
    }
  },
  plugins: [],
}
