/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        arcade: {
          darkest: '#050510',
          bg: '#0a0a1f',
          card: '#121330',
          hover: '#191b42',
          border: '#252854',
          subtle: '#3b407a',
        },
        neon: {
          pink: '#FF2A6D',
          cyan: '#05D9E8',
          yellow: '#FFEA00',
          purple: '#A000FF',
          red: '#FF3366',
          green: '#00F59B',
        },
        destruct: {
          text: '#E2E8F0',
          muted: '#94A3B8',
          dim: '#64748B',
        }
      },
      fontFamily: {
        pixel: ['"VT323"', '"Courier New"', 'monospace'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
};
