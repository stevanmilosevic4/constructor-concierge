/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Constructor web palette — WCAG-compliant variants are mandatory on web.
        blue: { DEFAULT: "#00B2FF" },
        navy: { DEFAULT: "#00204D" },
        confident: { DEFAULT: "#01388C" },
        diversity: { DEFAULT: "#EB1700" },
        yellow: { DEFAULT: "#FFC700" },
        green: { DEFAULT: "#00D19E" },
        ink: "#141414",
        paper: "#F9F9F9",
        rule: "#D9E1EC",
        muted: "#5B6B82",
      },
      fontFamily: {
        sans: ['"ALS Hauss"', '"ALSHauss"', "Arial", "Helvetica Neue", "Helvetica", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,32,77,0.06), 0 8px 24px -12px rgba(0,32,77,0.18)",
        pop: "0 12px 40px -12px rgba(0,32,77,0.35)",
      },
      borderRadius: { xl2: "14px" },
    },
  },
  plugins: [],
}
