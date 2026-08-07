/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B1F23",
        surface: "#F7F5F2",
        card: "#FFFFFF",
        line: "#E7E3DB",
        accent: "#2F6F4F",
        accentSoft: "#E7F0EA",
        danger: "#B3432B",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
