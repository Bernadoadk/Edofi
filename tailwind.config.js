module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs personnalisées du nouveau schéma
        "primary-color": "#dfe0c5", // Couleur principale
        "secondary-color": "#04b1d9", // Couleur secondaire
        "accent-color": "#f24638", // Couleur d'accent
        "text-black": "#000000", // Noir pour les textes
        
        // Anciennes couleurs (maintenues pour compatibilité)
        "assignment-1dark-bluish-grey": "var(--assignment-1dark-bluish-grey)",
        "assignment-1dark-grey": "var(--assignment-1dark-grey)",
        "assignment-1dark-navy-blue": "var(--assignment-1dark-navy-blue)",
        "assignment-1light-grey": "var(--assignment-1light-grey)",
        "assignment-1white": "var(--assignment-1white)",
        "assignment-1yellow": "var(--assignment-1yellow)",
        "light-black": "var(--light-black)",
        
        // Variables CSS pour le système de design
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
        "assignment-1-big-title": "var(--assignment-1-big-title-font-family)",
        "assignment-1-big-title-w-line-height":
          "var(--assignment-1-big-title-w-line-height-font-family)",
        "assignment-1-medium-title":
          "var(--assignment-1-medium-title-font-family)",
        "assignment-1-section-title":
          "var(--assignment-1-section-title-font-family)",
        "assignment-1-small-text": "var(--assignment-1-small-text-font-family)",
        "assignment-1-small-title":
          "var(--assignment-1-small-title-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
