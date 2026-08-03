/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f1ff",
          100: "#e0e2ff",
          200: "#c3c6ff",
          300: "#9ba0ff",
          400: "#7a72ff",
          500: "#6552f5",
          600: "#5539e0",
          700: "#472dbd",
          800: "#3a2799",
          900: "#31237a",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
