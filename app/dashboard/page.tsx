'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePortfolio } from '@/contexts/PortfolioContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import InvestmentForm from '@/components/InvestmentForm'
import InvestmentHistory from '@/components/InvestmentHistory'
import RealTimePriceTracker from '@/components/RealTimePriceTracker'
import PriceAnalysis from '@/components/PriceAnalysis'
import PriceAlerts from '@/components/PriceAlerts'
import PlatformComparison from '@/components/PlatformComparison'
import SIPInvestment from '@/components/SIPInvestment'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const { 
    portfolio, 
    loading, 
    currentGoldPrice, 
    currentSilverPrice, 
    priceSource, 
    lastPriceUpdate,
    refreshPortfolio,
    refreshPrices 
  } = usePortfolio()
  const [showInvestmentForm, setShowInvestmentForm] = useState(false)

  const handleInvestmentSuccess = () => {
    refreshPortfolio()
  }

  const formatLastUpdate = (timestamp: string) => {
    if (!timestamp) return 'Unknown'
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    } catch {
      return 'Unknown'
    }
  }

  const getPriceSourceDisplay = (source: string) => {
    switch (source) {
      case 'goldpricez-api':
        return '🟢 Live API'
      case 'goldpricez-usd-converted':
        return '🟡 Live (USD→INR)'
      case 'metals-api-backup':
        return '🟡 Backup API'
      case 'fallback-with-variation':
        return '🔴 Simulated'
      case 'loading':
        return '⏳ Loading...'
      default:
        return '❓ Unknown'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your portfolio...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <PriceAlerts />
      <main className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            {/* Title Section */}
            <div className="text-center sm:text-left mb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Welcome to your <span className="font-bold text-gold-600 cursor-pointer">AURUM</span> Dashboard
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                Hello {user?.displayName || 'User'}, track your precious metals investments in real-time
              </p>
            </div>
            
            {/* Live Prices - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gold-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-gold-600 font-medium">Live Gold Price</div>
                    <div className="text-lg sm:text-xl font-bold text-gold-700">
                      ₹{currentGoldPrice.toLocaleString()}/g
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live updates"></span>
                    <span className="text-xs text-green-600 font-medium">LIVE</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-slate-600 font-medium">Live Silver Price</div>
                    <div className="text-lg sm:text-xl font-bold text-slate-700">
                      ₹{currentSilverPrice.toLocaleString()}/g
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live updates"></span>
                    <span className="text-xs text-green-600 font-medium">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Price Source Info - Collapsible on Mobile */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-700">
                  <span>{getPriceSourceDisplay(priceSource)}</span>
                  <span>•</span>
                  <span>Updates every minute</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <span>Updated: {formatLastUpdate(lastPriceUpdate)}</span>
                  <button
                    onClick={refreshPrices}
                    className="text-gold-600 hover:text-gold-700 underline font-medium touch-manipulation"
                    title="Refresh prices"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gold-100 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">💰</span>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Total Portfolio</h3>
                  <p className="text-lg sm:text-2xl font-bold text-gold-600">₹{portfolio.currentValue.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Investment: ₹{portfolio.totalInvestment.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center ${
                  portfolio.totalReturns >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className="text-xl sm:text-2xl">{portfolio.totalReturns >= 0 ? '📈' : '📉'}</span>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Total Returns</h3>
                  <p className={`text-lg sm:text-2xl font-bold ${
                    portfolio.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {portfolio.totalReturns >= 0 ? '+' : ''}₹{Math.abs(portfolio.totalReturns).toLocaleString()}
                  </p>
                  <p className={`text-xs sm:text-sm ${
                    portfolio.returnsPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {portfolio.returnsPercentage >= 0 ? '+' : ''}{portfolio.returnsPercentage}% overall
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gold-100 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">🥇</span>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Gold Holdings</h3>
                  <p className="text-lg sm:text-2xl font-bold text-gold-600">{portfolio.totalGoldQuantity}g</p>
                  <p className="text-xs sm:text-sm text-gray-500">Value: ₹{portfolio.goldValue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">🥈</span>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Silver Holdings</h3>
                  <p className="text-lg sm:text-2xl font-bold text-gray-600">{portfolio.totalSilverQuantity}g</p>
                  <p className="text-xs sm:text-sm text-gray-500">Value: ₹{portfolio.silverValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Metal Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Gold Portfolio */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🥇</span> Gold Portfolio
                </h2>
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-500">Current Price</div>
                  <div className="text-sm sm:text-lg font-bold text-gold-600">₹{currentGoldPrice.toLocaleString()}/g</div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gold-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600">Total Quantity</div>
                    <div className="text-lg sm:text-xl font-bold text-gold-600">{portfolio.totalGoldQuantity}g</div>
                  </div>
                  <div className="bg-gold-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600">Current Value</div>
                    <div className="text-lg sm:text-xl font-bold text-gold-600">₹{portfolio.goldValue.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600">Physical Gold</div>
                    <div className="text-sm sm:text-lg font-bold text-blue-600">{portfolio.physicalGold}g</div>
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600">Digital Gold</div>
                    <div className="text-sm sm:text-lg font-bold text-purple-600">{portfolio.digitalGold}g</div>
                  </div>
                </div>

                <div className={`p-3 sm:p-4 rounded-lg ${
                  portfolio.goldReturns >= 0 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-600">Gold Returns</div>
                      <div className={`text-sm sm:text-lg font-bold ${
                        portfolio.goldReturns >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {portfolio.goldReturns >= 0 ? '+' : ''}₹{Math.abs(portfolio.goldReturns).toLocaleString()}
                      </div>
                    </div>
                    <div className={`text-right text-sm sm:text-lg font-bold ${
                      portfolio.goldReturnsPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {portfolio.goldReturnsPercentage >= 0 ? '+' : ''}{portfolio.goldReturnsPercentage}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Silver Portfolio */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span>🥈</span> Silver Portfolio
                </h2>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Current Price</div>
                  <div className="text-lg font-bold text-slate-700">₹{currentSilverPrice.toLocaleString()}/g</div>
                </div>
              </div>

              {portfolio.totalSilverQuantity > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                      <div className="text-sm text-slate-600">Total Quantity</div>
                      <div className="text-xl font-bold text-slate-700">{portfolio.totalSilverQuantity}g</div>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                      <div className="text-sm text-slate-600">Current Value</div>
                      <div className="text-xl font-bold text-slate-700">₹{portfolio.silverValue.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600">Physical Silver</div>
                      <div className="text-lg font-bold text-blue-700">{portfolio.physicalSilver}g</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-sm text-purple-600">Digital Silver</div>
                      <div className="text-lg font-bold text-purple-700">{portfolio.digitalSilver}g</div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${
                    portfolio.silverReturns >= 0 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-slate-600">Silver Returns</div>
                        <div className={`text-lg font-bold ${
                          portfolio.silverReturns >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {portfolio.silverReturns >= 0 ? '+' : ''}₹{Math.abs(portfolio.silverReturns).toLocaleString()}
                        </div>
                      </div>
                      <div className={`text-right text-lg font-bold ${
                        portfolio.silverReturnsPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {portfolio.silverReturnsPercentage >= 0 ? '+' : ''}{portfolio.silverReturnsPercentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                      <div className="text-sm text-slate-600">Total Quantity</div>
                      <div className="text-xl font-bold text-slate-700">0g</div>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                      <div className="text-sm text-slate-600">Current Value</div>
                      <div className="text-xl font-bold text-slate-700">₹0</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600">Physical Silver</div>
                      <div className="text-lg font-bold text-blue-700">0g</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-sm text-purple-600">Digital Silver</div>
                      <div className="text-lg font-bold text-purple-700">0g</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-slate-600">Silver Returns</div>
                        <div className="text-lg font-bold text-emerald-600">+₹0</div>
                      </div>
                      <div className="text-right text-lg font-bold text-emerald-600">+0%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setShowInvestmentForm(true)}
                className="flex flex-col items-center p-6 border-2 border-gold-500 bg-gold-50 rounded-lg hover:bg-gold-100 transition-colors"
              >
                <span className="text-3xl mb-2">➕</span>
                <h3 className="font-semibold text-gray-900">Add Investment</h3>
                <p className="text-sm text-gray-600 text-center">Record gold or silver purchase</p>
              </button>

              <Link
                href="/compare"
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition-colors"
              >
                <span className="text-3xl mb-2">🔍</span>
                <h3 className="font-semibold text-gray-900">Compare Prices</h3>
                <p className="text-sm text-gray-600 text-center">Find best precious metal rates</p>
              </Link>

              <Link
                href="/analysis"
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition-colors"
              >
                <span className="text-3xl mb-2">📊</span>
                <h3 className="font-semibold text-gray-900">Market Analysis</h3>
                <p className="text-sm text-gray-600 text-center">View trends & insights</p>
              </Link>

              <button
                onClick={refreshPortfolio}
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition-colors"
              >
                <span className="text-3xl mb-2">🔄</span>
                <h3 className="font-semibold text-gray-900">Refresh Portfolio</h3>
                <p className="text-sm text-gray-600 text-center">Update latest values</p>
              </button>
            </div>
          </div>

          {/* Real-Time Price Tracking and Analysis */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <RealTimePriceTracker />
            <PriceAnalysis />
          </div>

          {/* SIP Investment */}
          <div className="mb-8">
            <SIPInvestment />
          </div>

          {/* Platform Comparison */}
          <div className="mb-8">
            <PlatformComparison />
          </div>

          {/* Investment History */}
          <InvestmentHistory />

          {/* Investment Form Modal */}
          {showInvestmentForm && (
            <InvestmentForm
              onClose={() => setShowInvestmentForm(false)}
              onSuccess={handleInvestmentSuccess}
            />
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}