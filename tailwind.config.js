/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Discipline colors — change these to re-theme the whole app
        swim: {
          DEFAULT: '#3182ce',
          light: '#bee3f8',
          dark: '#2c5282',
          text: '#2c5282',
        },
        bike: {
          DEFAULT: '#38a169',
          light: '#c6f6d5',
          dark: '#22543d',
          text: '#22543d',
        },
        run: {
          DEFAULT: '#e53e3e',
          light: '#fed7d7',
          dark: '#742a2a',
          text: '#742a2a',
        },
        brick: {
          DEFAULT: '#ed8936',
          light: '#feebc8',
          dark: '#7c2d12',
          text: '#7c2d12',
        },
        climbing: {
          DEFAULT: '#d69e2e',
          light: '#fef5e7',
          dark: '#744210',
          text: '#744210',
        },
        navy: {
          950: '#060b18',
          900: '#0d1424',
          800: '#131d35',
          700: '#1a2848',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'collapse': 'collapse 200ms ease-out',
        'expand': 'expand 250ms ease-out',
        'pulse-green': 'pulseGreen 2s ease-in-out',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(72, 187, 120, 0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(72, 187, 120, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
