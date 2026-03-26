/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        muted: "#6b6b6b",
        line: "#e7e2d9",
        paper: "#faf8f3",
        accent: "#1f5eff",
      },
      boxShadow: {
        card: "0 20px 60px rgba(17, 24, 39, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
