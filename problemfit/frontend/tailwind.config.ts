import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#050712",
        night: "#09111f",
        panel: "rgba(14, 24, 42, 0.74)",
        line: "rgba(148, 163, 184, 0.18)",
        aqua: "#2dd4bf",
        iris: "#8b5cf6",
        skyfire: "#38bdf8",
        ember: "#f59e0b",
        coral: "#fb7185",
        mint: "#86efac",
      },
      boxShadow: {
        glow: "0 0 38px rgba(45, 212, 191, 0.22)",
        violet: "0 0 42px rgba(139, 92, 246, 0.2)",
      },
      backgroundImage: {
        "radial-field": "radial-gradient(circle at 20% 20%, rgba(45, 212, 191, 0.18), transparent 32%), radial-gradient(circle at 82% 12%, rgba(139, 92, 246, 0.18), transparent 30%), radial-gradient(circle at 55% 92%, rgba(245, 158, 11, 0.11), transparent 26%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
