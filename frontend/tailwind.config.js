/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ink: "#05050A",
        ink2: "#0A0A0F",
        bone: "#F5F4EE",
        periwinkle: "#7B7FE8",
        rule: "rgba(255,255,255,0.10)",
        ruleHard: "rgba(255,255,255,0.18)",
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "ui-sans-serif", "system-ui"],
        serif: ["'Bricolage Grotesque'", "ui-serif"],
        sans: ["Geist", "ui-sans-serif", "system-ui"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        none: "0",
        xs: "2px",
        sm: "3px",
        md: "4px",
      },
      letterSpacing: {
        tightest: "-0.045em",
        mono: "0.16em",
      },
      animation: {
        "drift-1": "drift1 22s ease-in-out infinite",
        "drift-2": "drift2 28s ease-in-out infinite",
        "drift-3": "drift3 18s ease-in-out infinite",
        marquee: "marquee 45s linear infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
      },
      keyframes: {
        drift1: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -60px) scale(1.08)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.94)" },
        },
        drift2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-50px, 50px) scale(1.1)" },
        },
        drift3: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(20px, -30px) scale(1.06)" },
          "75%": { transform: "translate(-25px, 15px) scale(0.96)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
