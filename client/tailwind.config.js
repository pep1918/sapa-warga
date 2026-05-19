/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: { DEFAULT: '#0071E3', hover: '#006EDB', press: '#0076DF' },
          text: { dominant: '#1D1D1F', secondary: '#333336', tertiary: '#6E6E73', inverse: '#000000' },
          surface: { light: '#EDEDF2', nav: 'rgba(255, 255, 255, 0.8)', dark: '#272729' }
        }
      },
      fontFamily: {
        display: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        text: ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'apple-subtle': '0 1px 3px rgba(0, 0, 0, 0.12)',
        'apple-medium': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'apple-deep': '0 12px 32px rgba(0, 0, 0, 0.16)',
      }
    },
  },
  plugins: [],
}