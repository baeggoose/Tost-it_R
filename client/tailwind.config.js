/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main_skyblue: "#BDE3FF",
        main_bg_cloud: "#F5FBFF",
        point_blue: "#80CAFF",
      },
      fontFamily: {
        alfa: ["Alfa Slab One", "sans-serif"],
      },
      fontSize: {
        xsm: "0.7rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
      },
      spacing: {
        98: "24.375rem",
        450: "448px",
        600: "600px",
      },
    },
  },
  plugins: [],
};
