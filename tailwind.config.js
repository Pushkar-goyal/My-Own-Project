/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#0F4C81',
          navy: '#0B2545',
          gold: '#D4AF37',
          orange: '#FF7722',
          green: '#10B981',
          saffron: '#FF9933',
          ash: '#F4F6F9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
