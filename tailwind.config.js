/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // §10 design spec
        brand: {
          black: "#0F0F12",
          amber: "#F2C94C",
          violet: "#7C5CFF",
        },
        paper: "#F5F1E8",
        ink: "#1A1A1F",
        "dark-bg": "#16161A",
        "dark-text": "#EDEDEF",
      },
      fontFamily: {
        heading: ["Unbounded", "Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
