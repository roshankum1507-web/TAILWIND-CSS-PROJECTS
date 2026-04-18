/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff6ef",
          100: "#ffe6d4",
          500: "#d96f3f",
          600: "#bf5f34",
          700: "#9a4d2d"
        },
        mint: {
          100: "#dbf5f3",
          500: "#1e8e88"
        },
        amber: {
          100: "#fff0cf",
          500: "#d5971a"
        },
        rose: {
          100: "#ffe0dc",
          500: "#cc5a4d"
        }
      },
      boxShadow: {
        soft: "0 16px 50px -22px rgba(95, 58, 34, 0.35)"
      }
    }
  },
  plugins: []
};
