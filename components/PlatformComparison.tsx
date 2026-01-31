'use client'

import { useState } from 'react'
import { usePlatformPrices } from '@/contexts/PlatformPricesContext'
import Link from 'next/link'

export default function PlatformComparison() {
  const { 
    platformPrices, 
    loading, 
    getBestGoldDeals, 
    getBestSilverDeals,
    calculatePlatformCost,
    baseGoldPrice,
    baseSilverPrice,
    lastUpdated,
    refreshPlatformPrices
  } = usePlatformPrices()
  
  const [selectedMetal, setSelectedMetal] = useState<'gold' | 'silver'>('gold')
  const [weight, setWeight] = useState(10)

  const bestGoldDeals = getBestGoldDeals().slice(0, 3)
  const bestSilverDeals = getBestSilverDeals().slice(0, 3)
  const currentDeals = selectedMetal === 'gold' ? bestGoldDeals : bestSilverDeals

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

  const getPlatformIcon = (platform: string) => {
    if (platform.includes('Paytm')) return '💳'
    if (platform.includes('PhonePe')) return '📱'
    if (platform.includes('Google')) return '🔍'
    if (platform.includes('Amazon')) return '📦'
    if (platform.includes('MMTC')) return '🏛️'
    if (platform.includes('SafeGold')) return '🔒'
    if (platform.includes('Jar')) return '🏺'
    if (platform.includes('Groww')) return '🌱'
    if (platform.includes('Zerodha')) return '📊'
    if (platform.includes('Upstox')) return '📈'
    if (platform.includes('Angel')) return '👼'
    if (platform.includes('ICICI')) return '🏦'
    if (platform.includes('Tanishq')) return '💎'
    if (platform.includes('Kalyan')) return '👑'
    if (platform.includes('Malabar')) return '🏪'
    if (platform.includes('Joyalukkas')) return '💍'
    if (platform.includes('Reliance')) return '🏬'
    if (platform.includes('CaratLane')) return '💻'
    if (platform.includes('BlueStone')) return '💙'
    if (platform.includes('Candere')) return '🌟'
    if (platform.includes('Melorra')) return '✨'
    return '🏬'
  }

  const getTypeColor = (type: string) => {
    return type === 'digital' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>🏆</span> Best Platform Deals
        </h2>
        <div className="text-sm text-gray-500">
          Updated: {formatLastUpdate(lastUpdated)}
        </div>
      </div>

      {/* Metal Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedMetal('gold')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedMetal === 'gold'
              ? 'bg-gold-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🥇 Gold
        </button>
        <button
          onClick={() => setSelectedMetal('silver')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedMetal === 'silver'
              ? 'bg-gray-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🥈 Silver
        </button>
      </div>

      {/* Weight Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Weight (grams)
        </label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          min="1"
          max="1000"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
        />
      </div>

      {/* Best Deals */}
      <div className="space-y-3 mb-6">
        {currentDeals.map((platform, index) => {
          const totalCost = calculatePlatformCost(platform, selectedMetal, weight)
          const pricePerGram = selectedMetal === 'gold' ? platform.goldPricePerGram : platform.silverPricePerGram
          const basePrice = selectedMetal === 'gold' ? baseGoldPrice : baseSilverPrice
          const savings = index === 0 ? 0 : totalCost - calculatePlatformCost(currentDeals[0], selectedMetal, weight)
          
          return (
            <div 
              key={platform.platform} 
              className={`p-4 rounded-lg border-2 ${
                index === 0 
                  ? 'border-gold-500 bg-gold-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getPlatformIcon(platform.platform)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {platform.platform}
                      {index === 0 && <span className="ml-2 text-gold-600">🏆</span>}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(platform.type)}`}>
                      {platform.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    ₹{totalCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    ₹{pricePerGram.toLocaleString()}/g
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="text-gray-600">
                  {weight}g {selectedMetal} • GST: {platform.gst}%
                  {selectedMetal === 'gold' && platform.goldMakingCharges > 0 && ` • Making: ₹${platform.goldMakingCharges}/g`}
                  {selectedMetal === 'silver' && platform.silverMakingCharges > 0 && ` • Making: ₹${platform.silverMakingCharges}/g`}
                </div>
                {savings > 0 && (
                  <div className="text-green-600 font-medium">
                    Save ₹{savings.toLocaleString()}
                  </div>
                )}
              </div>
              
              {/* Top Features */}
              <div className="mt-2 flex flex-wrap gap-1">
                {platform.features.slice(0, 2).map((feature, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-white rounded-full text-gray-600">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Market Info */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="text-sm text-blue-800">
          <div className="flex justify-between items-center">
            <span>Base Market Price:</span>
            <span className="font-semibold">
              ₹{(selectedMetal === 'gold' ? baseGoldPrice : baseSilverPrice).toLocaleString()}/g
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link
          href={`/compare?metal=${selectedMetal}&weight=${weight}`}
          className="flex-1 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
        >
          Compare All Platforms
        </Link>
        <button
          onClick={refreshPlatformPrices}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
          title="Refresh prices"
        >
          🔄
        </button>
      </div>
    </div>
  )
}