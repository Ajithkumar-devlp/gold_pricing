'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePlatformPrices } from '@/contexts/PlatformPricesContext'

interface MetalPrice {
  platform: string
  type: 'physical' | 'digital'
  goldPricePerGram: number
  silverPricePerGram: number
  goldMakingCharges: number
  silverMakingCharges: number
  gst: number
  features: string[]
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const { 
    platformPrices, 
    loading: platformLoading, 
    refreshPlatformPrices,
    calculatePlatformCost,
    getFilteredPlatforms,
    getBestGoldDeals,
    getBestSilverDeals,
    baseGoldPrice,
    baseSilverPrice,
    lastUpdated,
    source
  } = usePlatformPrices()
  
  const [metalType, setMetalType] = useState<'gold' | 'silver' | 'both'>('both')
  const [investmentType, setInvestmentType] = useState<'physical' | 'digital' | 'both'>('both')
  const [weight, setWeight] = useState<number>(10)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const metal = searchParams.get('metal') as 'gold' | 'silver' | 'both'
    const type = searchParams.get('type') as 'physical' | 'digital' | 'both'
    if (metal) setMetalType(metal)
    if (type) setInvestmentType(type)
  }, [searchParams])

  const handleRefreshPrices = async () => {
    setLoading(true)
    await refreshPlatformPrices()
    setLoading(false)
  }

  // Filter platforms based on investment type
  const filteredPrices = getFilteredPlatforms(
    investmentType === 'both' ? undefined : investmentType
  )

  // Get best deals
  const bestGoldDeals = getBestGoldDeals(investmentType === 'both' ? undefined : investmentType)
  const bestSilverDeals = getBestSilverDeals(investmentType === 'both' ? undefined : investmentType)
  const bestGoldPrice = bestGoldDeals[0]
  const bestSilverPrice = bestSilverDeals[0]

  const calculateTotalCost = (platform: any, metal: 'gold' | 'silver') => {
    return calculatePlatformCost(platform, metal, weight)
  }

  const getSortedPrices = (metal: 'gold' | 'silver') => {
    return [...filteredPrices].sort((a, b) => 
      calculateTotalCost(a, metal) - calculateTotalCost(b, metal)
    )
  }

  const goldSortedPrices = getSortedPrices('gold')
  const silverSortedPrices = getSortedPrices('silver')

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
      case 'gold-api-com':
      case 'metals-api-com':
      case 'commodities-api-com':
        return '🟢 Live Market Data'
      case 'market-based-simulation':
        return '🟡 Market Simulation'
      case 'fallback-simulation':
        return '🔴 Fallback Data'
      default:
        return '❓ Unknown Source'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AURUM Precious Metals Comparison
          </h1>
          <p className="text-lg text-gray-600">
            Real-time gold and silver prices across 25+ platforms - Updated every minute
          </p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="flex items-center justify-center gap-2">
              {getPriceSourceDisplay(source)} • Last updated: {formatLastUpdate(lastUpdated)}
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live updates"></span>
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metal Type
              </label>
              <select 
                value={metalType}
                onChange={(e) => setMetalType(e.target.value as 'gold' | 'silver' | 'both')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="both">Compare Both</option>
                <option value="gold">Gold Only</option>
                <option value="silver">Silver Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Type
              </label>
              <select 
                value={investmentType}
                onChange={(e) => setInvestmentType(e.target.value as 'physical' | 'digital' | 'both')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="both">Compare Both</option>
                <option value="physical">Physical Only</option>
                <option value="digital">Digital Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (grams)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                min="1"
                max="1000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleRefreshPrices}
            disabled={loading || platformLoading}
            className="mt-4 bg-gold-500 hover:bg-gold-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {loading || platformLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating Prices...
              </>
            ) : (
              <>
                🔄 Update Real-Time Prices
              </>
            )}
          </button>
          
          {/* Market Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <div className="flex justify-between items-center">
                <span>Base Market Prices:</span>
                <span>Gold: ₹{baseGoldPrice.toLocaleString()}/g | Silver: ₹{baseSilverPrice.toLocaleString()}/g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best Deal Highlights */}
        {!loading && !platformLoading && filteredPrices.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {(metalType === 'gold' || metalType === 'both') && bestGoldPrice && (
              <div className="bg-gradient-to-r from-gold-400 to-gold-600 text-white rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">🏆 Best Gold Deal!</h3>
                    <p className="text-lg">
                      <strong>{bestGoldPrice.platform}</strong> - ₹{calculateTotalCost(bestGoldPrice, 'gold').toLocaleString()} 
                      for {weight}g ({bestGoldPrice.type} gold)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">You save</p>
                    <p className="text-2xl font-bold">
                      ₹{(calculateTotalCost(goldSortedPrices[goldSortedPrices.length - 1], 'gold') - calculateTotalCost(bestGoldPrice, 'gold')).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(metalType === 'silver' || metalType === 'both') && bestSilverPrice && (
              <div className="bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">🥈 Best Silver Deal!</h3>
                    <p className="text-lg">
                      <strong>{bestSilverPrice.platform}</strong> - ₹{calculateTotalCost(bestSilverPrice, 'silver').toLocaleString()} 
                      for {weight}g ({bestSilverPrice.type} silver)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">You save</p>
                    <p className="text-2xl font-bold">
                      ₹{(calculateTotalCost(silverSortedPrices[silverSortedPrices.length - 1], 'silver') - calculateTotalCost(bestSilverPrice, 'silver')).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price Comparison Tables */}
        {(metalType === 'gold' || metalType === 'both') && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-4 bg-gold-500 text-white">
              <h2 className="text-xl font-semibold">Gold Price Comparison for {weight}g</h2>
            </div>

            {loading || platformLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Fetching latest gold prices...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/gram</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Making Charges</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {goldSortedPrices.map((price, index) => (
                      <tr key={`gold-${price.platform}`} className={index === 0 ? 'bg-gold-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-900">
                              {price.platform}
                              {index === 0 && <span className="ml-2 text-gold-600">🏆</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            price.type === 'physical' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {price.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{price.goldPricePerGram.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(price.goldMakingCharges * weight).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{calculateTotalCost(price, 'gold').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <ul className="list-disc list-inside">
                            {price.features.slice(0, 2).map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {(metalType === 'silver' || metalType === 'both') && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-4 bg-gray-500 text-white">
              <h2 className="text-xl font-semibold">Silver Price Comparison for {weight}g</h2>
            </div>

            {loading || platformLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Fetching latest silver prices...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/gram</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Making Charges</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {silverSortedPrices.map((price, index) => (
                      <tr key={`silver-${price.platform}`} className={index === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-900">
                              {price.platform}
                              {index === 0 && <span className="ml-2 text-gray-600">🥈</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            price.type === 'physical' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {price.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{price.silverPricePerGram.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(price.silverMakingCharges * weight).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{calculateTotalCost(price, 'silver').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <ul className="list-disc list-inside">
                            {price.features.slice(0, 2).map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button 
            onClick={() => window.location.href = '/analysis?action=profit&weight=' + weight + '&metal=' + metalType + '&type=' + investmentType}
            className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Calculate Profit Potential
          </button>
          <button 
            onClick={() => window.location.href = '/analysis?action=growth&weight=' + weight + '&metal=' + metalType + '&type=' + investmentType}
            className="bg-white hover:bg-gray-50 text-gold-600 border-2 border-gold-500 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View Growth Analysis
          </button>
        </div>
      </div>
    </main>
  )
}