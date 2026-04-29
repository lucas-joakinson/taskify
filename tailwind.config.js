/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        foreground: "rgb(var(--text-primary) / <alpha-value>)",
        border: "rgb(var(--border-color) / <alpha-value>)",
        input: "rgb(var(--input-bg) / <alpha-value>)",
        primary: {
          light: "#c084fc",
          DEFAULT: "#a855f7",
          dark: "#7e22ce",
        },
        accent: "#9333ea",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.4)',
        'glow-sm': '0 0 10px rgba(168, 85, 247, 0.2)',
      }
    },
  },
  plugins: [],
}
