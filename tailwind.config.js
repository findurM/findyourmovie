module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1025px",
      xl: "1280px",
      xl2: "1360px",
    },
    extend: {
      spacing: {},
      left: {
        "12.5%": "12.5%",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: ["bumblebee"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: "luxury",
  },
};
