'use client'

import { useState } from 'react'
import { usePortfolio } from '@/contexts/PortfolioContext'

export default function PriceImpactCalculator() {
  const { currentGoldPrice, currentSilverPrice, portfolio } = usePortfolio()
  const [priceChange, setPriceChange] = useState<number>(0)
  const [selectedMetal, setSelectedMetal] = useState<'gold' | 'silver'>('gold')

  const calculateImpact = () => {
    const currentPrice = selectedMetal === 'gold' ? currentGoldPrice : currentSilverPrice
    const newPrice = currentPrice + priceChange
    const quantity = selectedMetal === 'gold' ? portfolio.totalGoldQuantity : portfolio.totalSilverQuantity
    
    const currentValue = quantity * currentPrice
    const newValue = quantity * newPrice
    const impact = newValue - currentValue
    const impactPercentage = currentValue > 0 ? (impact / currentValue) * 100 : 0

    return {
      currentPrice,
      newPrice,
      quantity,
      currentValue,
      newValue,
      impact,
      impactPercentage
    }
  }

  const impact = calculateImpact()

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span>🧮</span> Price Impact Calculator
      </h2>

      <div className="space-y-4">
        {/* Metal Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Metal
          </label>
          <div className="flex gap-2">
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
        </div>

        {/* Price Change Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Change (₹/gram)
          </label>
          <input
            type="number"
            value={priceChange}
            onChange={(e) => setPriceChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            placeholder="Enter price change (+ or -)"
            step="0.01"
          />
          <p className="text-xs text-gray-500 mt-1">
            Current {selectedMetal} price: ₹{impact.currentPrice.toLocaleString()}/g
          </p>
        </div>

        {/* Results */}
        {priceChange !== 0 && impact.quantity > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Impact Analysis</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">New Price:</span>
                <div className="font-semibold">₹{impact.newPrice.toLocaleString()}/g</div>
              </div>
              <div>
                <span className="text-gray-600">Your Holdings:</span>
                <div className="font-semibold">{impact.quantity}g</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Value:</span>
                <div className="font-semibold">₹{impact.currentValue.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">New Value:</span>
                <div className="font-semibold">₹{impact.newValue.toLocaleString()}</div>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${
              impact.impact >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Portfolio Impact:</span>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    impact.impact >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {impact.impact >= 0 ? '+' : ''}₹{Math.abs(impact.impact).toLocaleString()}
                  </div>
                  <div className={`text-sm ${
                    impact.impact >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {impact.impactPercentage >= 0 ? '+' : ''}{impact.impactPercentage.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Holdings Message */}
        {impact.quantity === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              You don't have any {selectedMetal} holdings yet. Add some investments to see price impact analysis.
            </p>
          </div>
        )}

        {/* Quick Scenarios */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Quick Scenarios</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPriceChange(selectedMetal === 'gold' ? 200 : 20)}
              className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              +₹{selectedMetal === 'gold' ? '200' : '20'} increase
            </button>
            <button
              onClick={() => setPriceChange(selectedMetal === 'gold' ? -200 : -20)}
              className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              -₹{selectedMetal === 'gold' ? '200' : '20'} decrease
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}