/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2BD17E",
        error: "#EB5757",
        background: "#093545",
        input: "#224957",
        card: "#092C39",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      spacing: {
        pagePadding: "120px",
      },
    },
  },
  plugins: [],
};
