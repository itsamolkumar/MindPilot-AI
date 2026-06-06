/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        mist: "#eef4f1",
        fern: "#26735b",
        coral: "#e3655b",
        amber: "#d99a2b",
        skysoft: "#dcecf8",
      },
      boxShadow: {
        soft: "0 18px 48px rgba(23, 32, 38, 0.08)",
      },
    },
  },
  plugins: [],
};
