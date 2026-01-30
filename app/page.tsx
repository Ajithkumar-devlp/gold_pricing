'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [selectedGoldType, setSelectedGoldType] = useState<'physical' | 'digital' | 'both'>('both')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Make Smart Gold Investment Decisions with AURUM
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Compare physical and digital gold prices across multiple platforms, analyze growth trends, 
            and calculate profits with AURUM's intelligent gold buying guide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/compare" className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Compare Gold Prices
            </Link>
            <Link href="/analysis" className="bg-white hover:bg-gray-50 text-gold-600 border-2 border-gold-500 px-8 py-3 rounded-lg font-semibold transition-colors">
              Analyze Gold Growth
            </Link>
          </div>
        </div>
      </section>

      {/* Gold Type Selection */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Gold Investment Type
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div 
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedGoldType === 'physical' 
                  ? 'border-gold-500 bg-gold-50' 
                  : 'border-gray-200 bg-white hover:border-gold-300'
              }`}
              onClick={() => setSelectedGoldType('physical')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Physical Gold</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Jewelry, coins, and bars from trusted dealers
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Tangible asset</li>
                  <li>• Higher making charges</li>
                  <li>• Storage required</li>
                  <li>• Traditional investment</li>
                </ul>
              </div>
            </div>

            <div 
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedGoldType === 'digital' 
                  ? 'border-gold-500 bg-gold-50' 
                  : 'border-gray-200 bg-white hover:border-gold-300'
              }`}
              onClick={() => setSelectedGoldType('digital')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Digital Gold</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Apps like Paytm, PhonePe, Google Pay
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• No storage hassle</li>
                  <li>• Lower charges</li>
                  <li>• High liquidity</li>
                  <li>• Modern investment</li>
                </ul>
              </div>
            </div>

            <div 
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedGoldType === 'both' 
                  ? 'border-gold-500 bg-gold-50' 
                  : 'border-gray-200 bg-white hover:border-gold-300'
              }`}
              onClick={() => setSelectedGoldType('both')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Compare Both</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Side-by-side comparison analysis
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Best price finder</li>
                  <li>• Profit calculator</li>
                  <li>• Smart recommendations</li>
                  <li>• Data-driven insights</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link 
              href={`/compare?type=${selectedGoldType}`}
              className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Start Comparison
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose AURUM?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Price Comparison</h3>
              <p className="text-gray-600">
                Compare gold prices across multiple platforms in real-time to find the best deals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Analysis</h3>
              <p className="text-gray-600">
                Visualize historical gold price trends and analyze growth patterns over time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Profit Calculator</h3>
              <p className="text-gray-600">
                Calculate potential profits and returns based on your investment timeline.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}