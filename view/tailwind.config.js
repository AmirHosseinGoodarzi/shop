module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      screens: {
        sm: "1000px",
        md: "1000px",
        lg: "1000px",
        xl: "1000px",
        "2xl": "1000px",
      },
    },
    extend: {
      colors: {
        purple: "#6C5DD3",
        orange: "#FF754C"
      }
    }
  },
  plugins: [],
}