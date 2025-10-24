import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Senior-friendly font sizes (18px base instead of 16px)
      fontSize: {
        base: ['18px', { lineHeight: '1.8' }],
        lg: ['20px', { lineHeight: '1.8' }],
        xl: ['24px', { lineHeight: '1.6' }],
        '2xl': ['28px', { lineHeight: '1.4' }],
        '3xl': ['36px', { lineHeight: '1.3' }],
        '4xl': ['48px', { lineHeight: '1.2' }],
      },
      // WCAG AAA compliant colors
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        slate: {
          50: '#fcfcfd',
          100: '#f9f9fb',
          200: '#f0f0f3',
          300: '#e8e8ec',
          400: '#e0e1e6',
          500: '#8b8d98',
          600: '#62636c',
          700: '#4a4a4a',
          800: '#2a2a2a',
          900: '#1e1f24',
          950: '#1a1a1a',
        },
        indigo: {
          50: '#edf2fe',
          100: '#e1e9ff',
          200: '#d2deff',
          300: '#c1d0ff',
          400: '#abbdff',
          500: '#8da4ef',
          600: '#3e63dd',
          700: '#3358d4',
          800: '#3a5bc7',
          900: '#1f2d5c',
        },
      },
      // Senior-friendly spacing
      spacing: {
        btn: '60px',      // Button height
        'btn-lg': '70px', // Large button height
        touch: '48px',    // Minimum touch target
      },
      // Focus ring for accessibility
      ringWidth: {
        'focus': '4px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
