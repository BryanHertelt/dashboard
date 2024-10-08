const colors = require('tailwindcss/colors')


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors:{
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray, 
      blue: "#1872FF",
      backgroundchild: '#EFEEF3'
    },
  },
  plugins: [],
}

