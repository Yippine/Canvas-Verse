/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Extended based on canvas_index.jsx UI design requirements
      colors: {
        // Add custom colors if needed
      },
      spacing: {
        // Add custom spacing if needed
      },
      animation: {
        // Custom animations for Framer Motion integration
      },
    },
  },
  plugins: [],
}
