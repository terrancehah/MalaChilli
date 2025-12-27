/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // MakanTak Brand Colors (User Custom Palette)
        primary: {
          DEFAULT: "#fb8241ff", // Vibrant Orange
          dark: "#E55A10", // Deep Orange
          light: "#FF8E52", // Light Orange
          foreground: "#222222", // Dark Charcoal (High Contrast)
        },
        secondary: {
          DEFAULT: "#F5E7C6", // Beige
          foreground: "#222222", // Dark Charcoal
        },
        accent: {
          DEFAULT: "#FF6D1F",
          foreground: "#222222",
        },
        background: {
          DEFAULT: "#FAF3E1", // Cream
          paper: "#FFFFFF",
        },
        // Semantic Colors
        success: "#2E7D32",
        warning: "#ED6C02",
        error: "#D32F2F",
        info: "#0288D1",
        // Gray Scale - Neutral
        gray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
        },
        // Shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // background: 'hsl(var(--background))', // Overridden above
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Quicksand", "sans-serif"], // Friendly, rounded headings
        cursive: ["Pacifico", "cursive"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "9999px", // Full pill shape
        card: "1rem", // 16px Card border radius
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(255, 109, 31, 0.1)",
        glow: "0 0 15px rgba(245, 231, 198, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
