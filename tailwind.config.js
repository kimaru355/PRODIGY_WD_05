/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "blue-1": "rgba(129, 136, 226, 0.6)",
      },
    },
  },
  plugins: [],
};
