/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            50: '#f3f6f4',
            100: '#e2eae5',
            500: '#2d6a4f',
            800: '#1b4332', // Primary theme color
            900: '#112a1f',
          },
          gold: {
            100: '#fef3c7',
            500: '#d97706', // Accent color
            600: '#b45309',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
