/**
 * Tailwind config seed — merge into the generated tailwind.config.ts
 * after running create-next-app. This extends Tailwind with the
 * BioFlow Blocks design tokens so arbitrary-value usage is minimized.
 */
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
        canvas:        'oklch(96% 0.010 85)',
        surface:       'oklch(99% 0.005 85)',
        'surface-2':   'oklch(93% 0.012 85)',
        border:        'oklch(88% 0.015 85)',
        'border-strong': 'oklch(78% 0.020 85)',

        text: {
          primary:   'oklch(24% 0.018 260)',
          secondary: 'oklch(52% 0.020 260)',
          muted:     'oklch(68% 0.015 260)',
        },

        teal: {
          50:  'oklch(95% 0.030 195)',
          100: 'oklch(90% 0.055 195)',
          400: 'oklch(72% 0.130 195)',
          500: 'oklch(60% 0.145 195)',
          600: 'oklch(50% 0.140 195)',
          700: 'oklch(40% 0.120 195)',
        },

        success: 'oklch(58% 0.160 150)',
        warning: 'oklch(68% 0.150  75)',
        error:   'oklch(55% 0.170  20)',
        info:    'oklch(60% 0.130 250)',

        block: {
          start:    'oklch(48% 0.130 145)',
          data:     'oklch(46% 0.140 250)',
          analysis: 'oklch(44% 0.150 270)',
          process:  'oklch(50% 0.130  75)',
          report:   'oklch(46% 0.145 195)',
          output:   'oklch(46% 0.140 155)',
          text:     'oklch(99% 0.005 85)',
        },

        mission: {
          active:   'oklch(68% 0.140 195)',
          complete: 'oklch(62% 0.155 150)',
          locked:   'oklch(75% 0.015 260)',
        },

        'focus-ring': 'oklch(60% 0.145 195)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1.4' }],
        sm:   ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem',     { lineHeight: '1.6' }],
        xl:   ['1.25rem',  { lineHeight: '1.4' }],
        '2xl':['1.5rem',   { lineHeight: '1.3' }],
      },

      fontWeight: {
        normal:   '400',
        semibold: '600',
        bold:     '700',
      },

      borderRadius: {
        sm: '0.375rem',
        md: '0.625rem',
        lg: '0.875rem',
        xl: '1.25rem',
      },

      spacing: {
        1:  '0.25rem',
        2:  '0.5rem',
        3:  '0.75rem',
        4:  '1rem',
        6:  '1.5rem',
        8:  '2rem',
        12: '3rem',
      },

      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      transitionDuration: {
        fast:   '180ms',
        normal: '200ms',
      },

      screens: {
        tablet:  '768px',
        desktop: '1280px',
      },
    },
  },
  plugins: [],
}

export default config
