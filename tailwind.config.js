/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Esto habilita modo oscuro con la clase 'dark'
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
