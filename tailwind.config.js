// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        customGreen: "#459132", 
        buttonColor:'#61AD4E',
        redColor:'#FF2A2A',
        lightBlack:'#666666',
        lightWhite:'#FFFFFF',
        ligghtGray:'#F5F5F5'
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    
    
  },
  plugins: [],
}
