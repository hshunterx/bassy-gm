/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Tambahkan font Inter
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.3' },
        },
        'float': {
          '0%': { transform: 'translate(0, 0) scale(0.5)', opacity: '0.5' },
          '25%': { transform: 'translate(10vw, 5vh) scale(0.7)', opacity: '0.7' },
          '50%': { transform: 'translate(0, 10vh) scale(0.9)', opacity: '0.9' },
          '75%': { transform: 'translate(-10vw, 5vh) scale(0.7)', opacity: '0.7' },
          '100%': { transform: 'translate(0, 0) scale(0.5)', opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-down': 'fade-in 0.5s ease-out forwards', // Duplikasi untuk spesifik
        'scale-in': 'scale-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-slow': 'pulse-slow 8s infinite ease-in-out',
        'float': 'float 10s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};