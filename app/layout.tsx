import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { PortfolioProvider } from '@/contexts/PortfolioContext'
import { PlatformPricesProvider } from '@/contexts/PlatformPricesContext'
import Navigation from '@/components/Navigation'
import ErrorBoundary from '@/components/ErrorBoundary'

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
        <ErrorBoundary>
          <AuthProvider>
            <PortfolioProvider>
              <PlatformPricesProvider>
                <Navigation />
                {children}
              </PlatformPricesProvider>
            </PortfolioProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}