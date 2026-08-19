import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: { DEFAULT: '#070B14', elevated: '#0F1729' },
        glass: {
          bg: 'rgba(255,255,255,0.045)',
          'bg-hover': 'rgba(255,255,255,0.075)',
          border: 'rgba(255,255,255,0.10)',
        },
        accent: { DEFAULT: '#22D3EE', dim: '#0E7490' },
        success: { DEFAULT: '#34D399', dim: '#065F46' },
        warning: { DEFAULT: '#FBBF24', dim: '#78350F' },
        danger: { DEFAULT: '#FB7185', dim: '#881337' },
        info: { DEFAULT: '#A78BFA', dim: '#4C1D95' },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Thang chữ tối ưu cho TV @1920x1080 — body ≥18px, KPI ~30px
        caption: ['18px', { lineHeight: '24px', fontWeight: '500' }],
        'body-md': ['18px', { lineHeight: '24px', fontWeight: '400' }],
        'body-lg': ['20px', { lineHeight: '26px', fontWeight: '500' }],
        'heading-md': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'display-lg': ['30px', { lineHeight: '34px', fontWeight: '700' }],
        'display-xl': ['36px', { lineHeight: '40px', fontWeight: '700' }],
      },
      backdropBlur: {
        glass: '20px',
        'glass-lg': '28px',
        'glass-xl': '40px',
      },
      boxShadow: {
        glass:
          '0 8px 32px rgba(0,0,0,.36), inset 0 1px 0 rgba(255,255,255,.16)',
        'glow-accent': '0 0 24px rgba(34,211,238,.35)',
        'glow-danger': '0 0 24px rgba(251,113,133,.35)',
      },
      keyframes: {
        aurora: {
          '0%': { transform: 'translate3d(0px, 0px, 0px) scale(1)' },
          '50%': { transform: 'translate3d(26px, -18px, 0px) scale(1.03)' },
          '100%': { transform: 'translate3d(0px, 0px, 0px) scale(1)' },
        },
      },
      gridTemplateColumns: {
        dashboard: 'repeat(12, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        dashboard: 'repeat(9, minmax(0, 1fr))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(.4,0,.6,1) infinite',
        aurora: 'aurora 24s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config

