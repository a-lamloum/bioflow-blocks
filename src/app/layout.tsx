import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BioFlow Blocks',
  description: 'A visual learning simulator for Nextflow and nf-core pipeline concepts.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      {/*
        Anti-FOUC: apply the saved theme class before React hydrates.
        This runs synchronously so there is no flash of the wrong theme.
        suppressHydrationWarning on <html> prevents a mismatch warning
        when the class differs between server and client.
      */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var t = localStorage.getItem('bioflow_theme');
    var dark = t === 'dark' || (t === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) {
      var el = document.documentElement;
      el.classList.add('dark');
      el.style.colorScheme = 'dark';
      var v = {
        '--color-canvas':        'oklch(16% 0.018 220)',
        '--color-surface':       'oklch(20% 0.020 220)',
        '--color-surface-2':     'oklch(25% 0.022 220)',
        '--color-border':        'oklch(33% 0.022 220)',
        '--color-border-strong': 'oklch(43% 0.025 220)',
        '--color-fg-primary':    'oklch(94% 0.010 200)',
        '--color-fg-secondary':  'oklch(72% 0.018 200)',
        '--color-fg-muted':      'oklch(52% 0.016 200)',
        '--color-teal-50':       'oklch(20% 0.040 195)',
        '--color-teal-100':      'oklch(28% 0.060 195)',
        '--color-teal-400':      'oklch(75% 0.145 195)',
        '--color-teal-500':      'oklch(66% 0.155 195)',
        '--color-teal-600':      'oklch(55% 0.148 195)',
        '--color-teal-700':      'oklch(44% 0.128 195)',
        '--color-focus-ring':    'oklch(66% 0.155 195)'
      };
      Object.keys(v).forEach(function(k){ el.style.setProperty(k, v[k]); });
    }
  } catch(e) {}
})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  )
}
