import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
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
        "electric-blue": {
          DEFAULT: "hsl(var(--electric-blue))",
          hover: "hsl(var(--electric-blue-hover))",
          light: "hsl(var(--electric-blue-light))",
          dark: "hsl(var(--electric-blue-dark))",
        },
        "energy-orange": {
          DEFAULT: "hsl(var(--energy-orange))",
          hover: "hsl(var(--energy-orange-hover))",
          light: "hsl(var(--energy-orange-light))",
        },
        "accent-cyan": {
          DEFAULT: "hsl(var(--accent-cyan))",
          light: "hsl(var(--accent-cyan-light))",
        },
        "success-green": {
          DEFAULT: "hsl(var(--success-green))",
          light: "hsl(var(--success-green-light))",
        },
        "danger-red": "hsl(var(--danger-red))",
        "soft-grey": "hsl(var(--soft-grey))",
        "medium-grey": "hsl(var(--medium-grey))",
        "deep-black": "hsl(var(--deep-black))",
        "accent-purple": {
          DEFAULT: "hsl(var(--accent-purple))",
          light: "hsl(var(--accent-purple-light))",
        },
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'colored-blue': 'var(--shadow-colored-blue)',
        'colored-orange': 'var(--shadow-colored-orange)',
        'glow-blue': 'var(--shadow-glow-blue)',
        'glow-orange': 'var(--shadow-glow-orange)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '2xl': '1rem',
        '3xl': '1.5rem',
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
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(245, 158, 11, 0.5)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in": "slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-marker": "pulseMarker 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
