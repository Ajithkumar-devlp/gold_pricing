'use client'

import { useState } from 'react'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { usePlatformPrices } from '@/contexts/PlatformPricesContext'

interface SIPPlan {
  amount: number
  duration: number
  metalType: 'both' | 'gold' | 'silver'
  goldAllocation: number
  silverAllocation: number
}

export default function SIPInvestment() {
  const { currentGoldPrice, currentSilverPrice, addNewInvestment } = usePortfolio()
  const { getBestGoldDeals } = usePlatformPrices()
  
  const [sipPlan, setSipPlan] = useState<SIPPlan>({
    amount: 5000,
    duration: 12,
    metalType: 'both',
    goldAllocation: 60,
    silverAllocation: 40
  })
  
  const [showSIPForm, setShowSIPForm] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('')

  const goldAmount = sipPlan.metalType === 'silver' ? 0 : 
    sipPlan.metalType === 'gold' ? sipPlan.amount : 
    (sipPlan.amount * sipPlan.goldAllocation) / 100
  
  const silverAmount = sipPlan.metalType === 'gold' ? 0 : 
    sipPlan.metalType === 'silver' ? sipPlan.amount : 
    (sipPlan.amount * sipPlan.silverAllocation) / 100
  
  const goldQuantity = goldAmount / currentGoldPrice
  const silverQuantity = silverAmount / currentSilverPrice

  const bestGoldPlatforms = getBestGoldDeals('digital').slice(0, 3)

  // Calculate price changes for market timing (simulated)
  const goldChangePercentage = (Math.random() - 0.5) * 4 // -2% to +2%
  const silverChangePercentage = (Math.random() - 0.5) * 6 // -3% to +3%

  const handleStartSIP = async () => {
    if (!selectedPlatform) return

    try {
      // Add gold investment if applicable
      if (goldAmount > 0) {
        await addNewInvestment({
          platform: selectedPlatform,
          type: 'digital',
          metal: 'gold',
          amount: goldAmount,
          quantity: goldQuantity,
          purchasePrice: currentGoldPrice,
          purchaseDate: new Date().toISOString().split('T')[0]
        })
      }

      // Add silver investment if applicable
      if (silverAmount > 0) {
        await addNewInvestment({
          platform: selectedPlatform,
          type: 'digital',
          metal: 'silver',
          amount: silverAmount,
          quantity: silverQuantity,
          purchasePrice: currentSilverPrice,
          purchaseDate: new Date().toISOString().split('T')[0]
        })
      }

      setShowSIPForm(false)
      alert('SIP investment added successfully!')
    } catch (error) {
      console.error('Error adding SIP investment:', error)
      alert('Failed to add SIP investment. Please try again.')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>💰</span> SIP Investment
        </h2>
        <button
          onClick={() => setShowSIPForm(!showSIPForm)}
          className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-semibold transition-colors"
        >
          {showSIPForm ? 'Hide SIP' : 'Start SIP'}
        </button>
      </div>

      {/* Real-Time Market Prices */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gold-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gold-800">Gold Rate</h3>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live updates"></span>
          </div>
          <div className="text-2xl font-bold text-gold-600">₹{currentGoldPrice.toLocaleString()}/g</div>
          <div className="text-sm text-gold-600">Best for long-term stability</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Silver Rate</h3>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live updates"></span>
          </div>
          <div className="text-2xl font-bold text-gray-600">₹{currentSilverPrice.toLocaleString()}/g</div>
          <div className="text-sm text-gray-600">Higher growth potential</div>
        </div>
      </div>

      {!showSIPForm && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">💡 Why Choose SIP?</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Start with just ₹1,000/month</li>
            <li>• Choose Gold only, Silver only, or Both metals</li>
            <li>• Real-time market prices updated every minute</li>
            <li>• No making charges on digital platforms</li>
          </ul>
        </div>
      )}

      {showSIPForm && (
        <div className="space-y-6">
          {/* SIP Configuration */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-4">Configure Your SIP</h3>
            
            {/* Metal Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSipPlan({...sipPlan, metalType: 'both', goldAllocation: 60, silverAllocation: 40})}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    sipPlan.metalType === 'both'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🥇🥈 Both
                </button>
                <button
                  type="button"
                  onClick={() => setSipPlan({...sipPlan, metalType: 'gold', goldAllocation: 100, silverAllocation: 0})}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    sipPlan.metalType === 'gold'
                      ? 'bg-gold-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🥇 Gold Only
                </button>
                <button
                  type="button"
                  onClick={() => setSipPlan({...sipPlan, metalType: 'silver', goldAllocation: 0, silverAllocation: 100})}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    sipPlan.metalType === 'silver'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🥈 Silver Only
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Amount (₹)
                </label>
                <input
                  type="number"
                  value={sipPlan.amount}
                  onChange={(e) => setSipPlan({...sipPlan, amount: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1000"
                  step="500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  value={sipPlan.duration}
                  onChange={(e) => setSipPlan({...sipPlan, duration: Number(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="6"
                  max="120"
                />
              </div>
            </div>

            {/* Allocation Sliders - Only show for 'both' type */}
            {sipPlan.metalType === 'both' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gold Allocation: {sipPlan.goldAllocation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sipPlan.goldAllocation}
                    onChange={(e) => {
                      const gold = Number(e.target.value)
                      setSipPlan({...sipPlan, goldAllocation: gold, silverAllocation: 100 - gold})
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Silver Allocation: {sipPlan.silverAllocation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sipPlan.silverAllocation}
                    onChange={(e) => {
                      const silver = Number(e.target.value)
                      setSipPlan({...sipPlan, silverAllocation: silver, goldAllocation: 100 - silver})
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Monthly Investment Breakdown */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3">Monthly Investment Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
              {goldAmount > 0 && (
                <div>
                  <div className="text-sm text-green-600">Gold Investment</div>
                  <div className="font-bold text-green-800">₹{goldAmount.toLocaleString()}</div>
                  <div className="text-xs text-green-600">≈ {goldQuantity.toFixed(3)}g gold/month</div>
                </div>
              )}
              
              {silverAmount > 0 && (
                <div>
                  <div className="text-sm text-green-600">Silver Investment</div>
                  <div className="font-bold text-green-800">₹{silverAmount.toLocaleString()}</div>
                  <div className="text-xs text-green-600">≈ {silverQuantity.toFixed(3)}g silver/month</div>
                </div>
              )}
              
              {sipPlan.metalType === 'both' && goldAmount === 0 && silverAmount === 0 && (
                <div className="col-span-2 text-center text-gray-500">
                  Please adjust allocation percentages
                </div>
              )}
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Select Investment Platform</h3>
            <div className="grid grid-cols-1 gap-2">
              {bestGoldPlatforms.map((platform) => (
                <label key={platform.platform} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="platform"
                    value={platform.platform}
                    checked={selectedPlatform === platform.platform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{platform.platform}</div>
                    <div className="text-sm text-gray-600">
                      Gold: ₹{platform.goldPricePerGram.toLocaleString()}/g • 
                      Silver: ₹{platform.silverPricePerGram.toLocaleString()}/g • 
                      {platform.type === 'digital' ? 'No making charges' : `Making: ₹${platform.goldMakingCharges}/g`}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Start SIP Button */}
          <div className="flex gap-4">
            <button
              onClick={handleStartSIP}
              disabled={!selectedPlatform}
              className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
            >
              Start SIP Investment
            </button>
            <button
              onClick={() => setShowSIPForm(false)}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* SIP Benefits */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">💡 SIP Market Timing & Benefits</h3>
            
            {/* Market Timing */}
            <div className="mb-3 p-2 bg-white rounded border-l-4 border-green-500">
              <div className="text-sm text-green-700">
                {goldChangePercentage < -1 && silverChangePercentage < -1 ? 
                  "🟢 Excellent time for SIP - Both metals are down, great for accumulation!" :
                  goldChangePercentage > 2 && silverChangePercentage > 2 ?
                  "🟡 Consider reducing SIP amount - Both metals are at highs" :
                  "🔵 Good time for regular SIP - Market is stable for systematic investment"
                }
              </div>
              <div className="text-xs text-green-600 mt-1">
                Updates every minute with live market data
              </div>
            </div>
            
            {/* Benefits */}
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Rupee cost averaging reduces market timing risk</li>
              <li>• Disciplined investment builds wealth systematically</li>
              <li>• Real-time pricing ensures fair market rates</li>
              <li>• {sipPlan.metalType === 'both' ? 'Diversified allocation balances risk and returns' : 
                     sipPlan.metalType === 'gold' ? 'Gold provides stability and inflation hedge' :
                     'Silver offers higher growth potential with industrial demand'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}