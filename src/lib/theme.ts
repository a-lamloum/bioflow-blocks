/**
 * Theme variable maps and application utility.
 *
 * We set variables directly on documentElement.style (inline styles)
 * rather than relying on a CSS class selector, because Tailwind v4
 * places @theme variables in a CSS layer that beats class-based overrides.
 * Inline styles have the highest specificity and always win.
 */

export const DARK_VARS: Record<string, string> = {
  '--color-canvas':          'oklch(16% 0.018 220)',
  '--color-surface':         'oklch(20% 0.020 220)',
  '--color-surface-2':       'oklch(25% 0.022 220)',
  '--color-border':          'oklch(33% 0.022 220)',
  '--color-border-strong':   'oklch(43% 0.025 220)',
  '--color-fg-primary':      'oklch(94% 0.010 200)',
  '--color-fg-secondary':    'oklch(72% 0.018 200)',
  '--color-fg-muted':        'oklch(52% 0.016 200)',
  '--color-teal-50':         'oklch(20% 0.040 195)',
  '--color-teal-100':        'oklch(28% 0.060 195)',
  '--color-teal-400':        'oklch(75% 0.145 195)',
  '--color-teal-500':        'oklch(66% 0.155 195)',
  '--color-teal-600':        'oklch(55% 0.148 195)',
  '--color-teal-700':        'oklch(44% 0.128 195)',
  '--color-focus-ring':      'oklch(66% 0.155 195)',
}

/** Apply dark or light theme by writing/clearing inline CSS vars on <html>. */
export function applyTheme(dark: boolean): void {
  const el = document.documentElement
  if (dark) {
    Object.entries(DARK_VARS).forEach(([k, v]) => el.style.setProperty(k, v))
    el.classList.add('dark')
    el.style.colorScheme = 'dark'
  } else {
    Object.keys(DARK_VARS).forEach(k => el.style.removeProperty(k))
    el.classList.remove('dark')
    el.style.colorScheme = 'light'
  }
}
