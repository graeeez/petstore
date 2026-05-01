/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petstore: {
          primary: '#1976d2',
          secondary: '#dc004e',
          success: '#4caf50',
          error: '#f44336',
          warning: '#ff9800',
          info: '#2196f3',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'lg': '0.5rem',
      },
    },
  },
  plugins: [],
}
