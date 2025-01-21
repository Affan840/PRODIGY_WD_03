/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-once': 'bounce 0.5s ease-in-out 1',
        'spin-once': 'spin 0.5s ease-in-out 1',
      },
    },
  },
  plugins: [],
}