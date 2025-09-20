/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial'],
      },
      colors: {
        surface: '#0b0f14',
        card: '#0f1621',
        ring: '#1e2a3a'
      },
      boxShadow: {
        glass: '0 8px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04)',
      }
    },
  },
  plugins: [],
}
