/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080B14", // Deeper, more modern enterprise dark blue
        panel: "rgba(18, 22, 36, 0.65)", // Glassmorphism base
        surface: "#121624",
        neon: {
          blue: "#00E5FF",
          pink: "#FF007F",
          purple: "#9D4EDD",
          green: "#00F5D4",
          gold: "#FFD166",
          orange: "#FF7B00"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 229, 255, 0.15)',
        'glow-pink': '0 0 20px rgba(255, 0, 127, 0.15)',
        'glow-purple': '0 0 20px rgba(157, 78, 221, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
