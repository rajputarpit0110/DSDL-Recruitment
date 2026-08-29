/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dsdl: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#f85160',
          500: '#eb2334',
          600: '#d81324', // KRIVA Metallic Crimson Red
          700: '#b90e1d',
          800: '#940c17',
          900: '#750b13',
          950: '#420308',
        },
        kml: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#f85160',
          500: '#eb2334',
          600: '#d81324', // KRIVA Metallic Crimson Red
          700: '#b90e1d',
          800: '#940c17',
          900: '#750b13',
          950: '#420308',
        },
        kiet: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
