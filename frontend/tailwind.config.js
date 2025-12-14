/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enables class-based dark mode (we control it through ThemeContext)
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // scan all React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
