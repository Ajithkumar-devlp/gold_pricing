import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AURUM - Intelligent Gold Rate Analysis & Buying Guide',
  description: 'Compare physical and digital gold prices, analyze growth trends, and make smart gold investment decisions with AURUM.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/aurum-logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-lg border-b border-gold-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <img src="/assets/logo1.png" alt="AURUM Logo" className="h-8 w-8 mr-3" />
                  <h1 className="text-2xl font-bold bg-clip-text text-gold">
                    AURUM
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </a>
                <a href="/compare" className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium">
                  Compare
                </a>
                <a href="/analysis" className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium">
                  Analysis
                </a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}