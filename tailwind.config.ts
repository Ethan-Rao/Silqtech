import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        'silq-blue': {
          DEFAULT: '#314780',
          50: '#E8EBF3',
          100: '#D1D8E7',
          200: '#A3B1CF',
          300: '#758AB7',
          400: '#47639F',
          500: '#314780',
          600: '#283966',
          700: '#1E2B4D',
          800: '#141D33',
          900: '#0A0F1A',
        },
        'silq-teal': {
          DEFAULT: '#00ADEF',
          50: '#E5F7FD',
          100: '#CCEFFC',
          200: '#99DFF9',
          300: '#66CFF6',
          400: '#33BFF3',
          500: '#00ADEF',
          600: '#008BBF',
          700: '#00688F',
          800: '#004660',
          900: '#002330',
        },
        // Neutral Colors
        'silq-dark': '#0E1216',
        'silq-light': '#EBEAE3',
        'silq-cream': '#F8F7F4',
      },
      fontFamily: {
        sans: ['var(--font-instrument)', 'system-ui', 'sans-serif'],
        display: ['var(--font-instrument)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-sm': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-sm': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0E1216 0%, #1a2332 50%, #314780 100%)',
        'silq-gradient': 'linear-gradient(135deg, #314780 0%, #00ADEF 100%)',
      },
    },
  },
  plugins: [],
}
export default config
