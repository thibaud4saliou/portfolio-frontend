/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { background: '#0a0a0a', foreground: '#f5f5f5', accent: '#333333' },
      fontFamily: { sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'] },
    },
  },
  plugins: [],
};
