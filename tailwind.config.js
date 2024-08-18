/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'text': '#0d1415',
        'background': '#f6fbfb',
        'primary': '#48b6c4',
        'secondary': '#91dfe8',
        'accent': '#e8fafc',
      }
    },
  },
  plugins: [],
}
