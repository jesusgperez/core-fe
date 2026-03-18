/** @type {import('tailwindcss').Config} */
import { colors } from './src/theme/colors.js'

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,svg}"
  ],
  theme: {
    extend: {
      colors,
      fontSize: {
        '2xs': '0.625rem'
      }
    },
    backgroundImage: () => ({
      'wave': "url(/src/assets/wave_background.svg)",
    })
  },
  plugins: [],
}

