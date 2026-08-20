import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata = {
  title: 'Nexora — Learn what moves you forward',
  description: 'A modern learning platform for curious minds. Learn from experts, build real projects, and shape your future.',
  generator: 'v0.app',
}

export const viewport = {
  colorScheme: 'dark',
  themeColor: '#020617',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
