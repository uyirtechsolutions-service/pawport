/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pawport: {
          orange: '#FF8A00',
          'orange-light': '#FF9D33',
          'orange-lighter': '#FFB366',
          'orange-dark': '#CC6E00',
          white: '#FFFFFF',
          black: '#111111',
          muted: '#222222',
        },
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(255, 138, 0, 0.25)',
        'brutal': '6px 6px 0px 0px #FF8A00',
      },
    },
  },
  plugins: [],
}