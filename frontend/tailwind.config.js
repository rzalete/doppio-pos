/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          950: "#1C0F07",
          900: "#2C1810",
          800: "#3D2314",
          700: "#4E2E1A",
        },
        gold: {
          300: "#F5C842",
          400: "#D4A843",
          500: "#C9A84C",
          600: "#A8893D",
        },
        cream: {
          50: "#FAF7F2",
          100: "#F0E8DC",
          200: "#D9C9B8",
        },
        muted: "#A89080",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};