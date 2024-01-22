/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        gray: {
          100: "var(--neutral-3)",
          200: "var(--neutral-3)",
          300: "var(--neutral-3)",
          400: "var(--neutral-2)",
          500: "var(--neutral-2)",
          600: "var(--neutral-1)",
          700: "var(--neutral-1)",
          800: "var(--neutral-1)",
          900: "var(--neutral-0)",
        },
        black: "var(--neutral-0)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          yellow: "var(--accent-1)",
          orange: "var(--accent-2)",
          blue: "var(--accent-3)",
          green: "var(--accent-4)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neutral: {
          1: "var(--neutral-1)",
          2: "var(--neutral-2)",
          3: "var(--neutral-3)",
          4: "var(--neutral-4)",
        },
        interactive: {
          1: "var(--interactive-1)",
          2: "var(--interactive-2)",
          3: "var(--interactive-3)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      transitionProperty: {
        width: "width",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)"],
        heading: ["var(--font-kalam)"],
      },
      letterSpacing: {
        tight: "-0.09rem",
        tighterish: "-0.18rem",
      },
      spacing: {
        "2.5xl": "44.125rem",
        "7xl": "87.5rem",
      },
      fontSize: {
        "2.5xl": "1.75rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
