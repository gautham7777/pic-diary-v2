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
        sans: ['Lora', 'serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'gentle': '0 10px 25px -5px var(--shadow-color), 0 8px 10px -6px var(--shadow-color)',
        'gentle-lg': '0 20px 40px -10px var(--shadow-color), 0 15px 25px -10px var(--shadow-color)',
      }
    },
  },
  plugins: [],
}
