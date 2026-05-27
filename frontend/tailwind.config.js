/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        titulo: ['Freude', 'sans-serif'],
        subtitulo: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

