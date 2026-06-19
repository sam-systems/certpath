import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  // Color semántico (niveles, dominios, estados, dificultad): se generan siempre
  // aunque las clases se construyan en mapas. Tonos suaves (50/100) — sobrios.
  safelist: [
    {
      pattern:
        /(bg|text|ring|border)-(slate|sky|rose|indigo|amber|violet|emerald|teal|cyan|orange)-(50|100|200|400|500|600|700)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        // Monocromo profesional (estilo Vercel/Linear): negro + grises neutros.
        // Sin azul "IA". El acento es casi negro; el color solo es semántico.
        brand: {
          DEFAULT: "#111111",
          dark: "#000000",
        },
        ink: "#171717",
        muted: "#737373",
        line: "#e5e5e5",
        canvas: "#fafafa",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04)",
      },
    },
  },
  plugins: [],
} satisfies Config;
