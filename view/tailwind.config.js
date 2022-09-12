module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      screens: {
        sm: '1200px',
        md: '1200px',
        lg: '1200px',
        xl: '1200px',
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        purple: '#6C5DD3',
        orange: {
          100: '#FF754C',
          200: '#ff9a7b',
        },
        mute: '#6a727a',
        success: '#7fba7a',
        dark: {
          100: '#33343b',
          200: '#242731',
          300: '#1F2128',
        },
      },
    },
  },
  plugins: [],
};
