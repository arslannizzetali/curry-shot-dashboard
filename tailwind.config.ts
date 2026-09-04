import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        warriors: {
          navy: "#06182E",
          blue: "#1D428A",
          royal: "#006BB6",
          gold: "#FDB927",
          cream: "#FFF3C4",
          green: "#22C55E",
          orange: "#F97316"
        }
      },
      boxShadow: {
        glow: "0 0 45px rgba(253, 185, 39, 0.28)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "court-radial":
          "radial-gradient(circle at 50% 0%, rgba(253, 185, 39, 0.28), transparent 38%)"
      }
    }
  },
  plugins: []
};

export default config;
