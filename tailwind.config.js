/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': 'var(--bg-primary)',
        'secondary-bg': 'var(--bg-secondary)',
        'primary-text': 'var(--text-primary)',
        'secondary-text': 'var(--text-secondary)',
        'accent': 'var(--accent-primary)',
        'accent-soft': 'var(--accent-secondary)',
        'accent-hover': 'var(--accent-hover)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Inter', 'sans-serif'], // Changed to Inter for modern look
      },
      boxShadow: {
        'gentle': '0 10px 25px -5px var(--shadow-color), 0 8px 10px -6px var(--shadow-color)',
        'gentle-lg': '0 20px 40px -10px var(--shadow-color), 0 15px 25px -10px var(--shadow-color)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 143, 171, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(255, 143, 171, 0)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'soft-pulse': 'soft-pulse 2s infinite',
      },
    },
  },
  plugins: [],
}