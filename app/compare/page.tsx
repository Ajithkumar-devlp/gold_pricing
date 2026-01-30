'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface GoldPrice {
  platform: string
  type: 'physical' | 'digital'
  pricePerGram: number
  makingCharges: number
  gst: number
  totalPrice: number
  features: string[]
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [goldType, setGoldType] = useState<'physical' | 'digital' | 'both'>('both')
  const [weight, setWeight] = useState<number>(10)
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const type = searchParams.get('type') as 'physical' | 'digital' | 'both'
    if (type) setGoldType(type)
    
    // Simulate fetching gold prices
    fetchGoldPrices()
  }, [searchParams])

  const fetchGoldPrices = async () => {
    setLoading(true)
    // Simulate API call - In real implementation, this would scrape actual websites
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockPrices: GoldPrice[] = [
      // Digital Gold Platforms
      {
        platform: 'Paytm Gold',
        type: 'digital',
        pricePerGram: 6720,
        makingCharges: 0,
        gst: 3,
        totalPrice: 6921.6,
        features: ['No storage cost', 'Instant liquidity', 'SIP available']
      },
      {
        platform: 'PhonePe Gold',
        type: 'digital',
        pricePerGram: 6715,
        makingCharges: 0,
        gst: 3,
        totalPrice: 6916.45,
        features: ['24/7 trading', 'No minimum amount', 'Digital certificate']
      },
      {
        platform: 'Google Pay Gold',
        type: 'digital',
        pricePerGram: 6710,
        makingCharges: 0,
        gst: 3,
        totalPrice: 6911.3,
        features: ['Secure storage', 'Easy redemption', 'Real-time prices']
      },
      {
        platform: 'Amazon Pay Gold',
        type: 'digital',
        pricePerGram: 6705,
        makingCharges: 0,
        gst: 3,
        totalPrice: 6906.15,
        features: ['Amazon ecosystem', 'Easy redemption', 'Secure storage']
      },
      {
        platform: 'MobiKwik Gold',
        type: 'digital',
        pricePerGram: 6718,
        makingCharges: 0,
        gst: 3,
        totalPrice: 6919.54,
        features: ['Wallet integration', 'Instant purchase', '24/7 trading']
      },
      {
        platform: 'MMTC-PAMP Gold',
        type: 'digital',
        pricePerGram: 6695,
        makingCharges: 0,
        gst: 3,
        totalPrice: 6895.85,
        features: ['Government backed', '999.9 purity', 'Swiss technology']
      },
      {
        platform: 'SafeGold',
        type: 'digital',
        pricePerGram: 6700,
        makingCharges: 0,
        gst: 3,
        totalPrice: 6901,
        features: ['MMTC-PAMP partnership', 'Blockchain secured', 'Instant liquidity']
      },
      {
        platform: 'Jar App Gold',
        type: 'digital',
        pricePerGram: 6714,
        makingCharges: 0,
        gst: 3,
        totalPrice: 6915.42,
        features: ['Round-up savings', 'Auto-invest', 'Goal-based saving']
      },
      // Physical Gold Platforms
      {
        platform: 'Tanishq',
        type: 'physical',
        pricePerGram: 6800,
        makingCharges: 500,
        gst: 3,
        totalPrice: 7324,
        features: ['Certified purity', 'Buyback guarantee', 'Physical delivery']
      },
      {
        platform: 'Kalyan Jewellers',
        type: 'physical',
        pricePerGram: 6750,
        makingCharges: 450,
        gst: 3,
        totalPrice: 7267.5,
        features: ['BIS hallmark', 'Exchange policy', 'Store pickup']
      },
      {
        platform: 'Malabar Gold',
        type: 'physical',
        pricePerGram: 6760,
        makingCharges: 480,
        gst: 3,
        totalPrice: 7297.2,
        features: ['International presence', 'Designer jewelry', 'Exchange policy']
      },
      {
        platform: 'HDFC Bank Gold',
        type: 'physical',
        pricePerGram: 6780,
        makingCharges: 400,
        gst: 3,
        totalPrice: 7303.4,
        features: ['Bank guarantee', 'Locker facility', 'Insurance covered']
      },
      {
        platform: 'SBI Gold',
        type: 'physical',
        pricePerGram: 6775,
        makingCharges: 380,
        gst: 3,
        totalPrice: 7289.65,
        features: ['Government bank', 'Trusted brand', 'Pan-India presence']
      },
      {
        platform: 'Joyalukkas',
        type: 'physical',
        pricePerGram: 6765,
        makingCharges: 470,
        gst: 3,
        totalPrice: 7292.95,
        features: ['Global brand', 'Traditional designs', 'Buyback policy']
      }
    ]
    
    setGoldPrices(mockPrices)
    setLoading(false)
  }

  const filteredPrices = goldPrices.filter(price => 
    goldType === 'both' || price.type === goldType
  )

  const calculateTotalCost = (price: GoldPrice) => {
    const basePrice = price.pricePerGram * weight
    const makingCost = price.makingCharges * weight
    const gstAmount = (basePrice + makingCost) * (price.gst / 100)
    return basePrice + makingCost + gstAmount
  }

  const sortedPrices = [...filteredPrices].sort((a, b) => 
    calculateTotalCost(a) - calculateTotalCost(b)
  )

  const bestPrice = sortedPrices[0]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AURUM Gold Price Comparison
          </h1>
          <p className="text-lg text-gray-600">
            Find the best gold prices across 15+ platforms
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gold Type
              </label>
              <select 
                value={goldType}
                onChange={(e) => setGoldType(e.target.value as 'physical' | 'digital' | 'both')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="both">Compare Both</option>
                <option value="physical">Physical Gold Only</option>
                <option value="digital">Digital Gold Only</option>
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
            onClick={fetchGoldPrices}
            className="mt-4 bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Update Prices
          </button>
        </div>

        {/* Best Deal Highlight */}
        {bestPrice && !loading && (
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🏆 Best Deal Found!</h3>
                <p className="text-lg">
                  <strong>{bestPrice.platform}</strong> - ₹{calculateTotalCost(bestPrice).toLocaleString()} 
                  for {weight}g ({bestPrice.type} gold)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">You save</p>
                <p className="text-2xl font-bold">
                  ₹{(calculateTotalCost(sortedPrices[sortedPrices.length - 1]) - calculateTotalCost(bestPrice)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Price Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gold-500 text-white">
            <h2 className="text-xl font-semibold">Price Comparison for {weight}g Gold</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Fetching latest gold prices...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price/gram
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Making Charges
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Features
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedPrices.map((price, index) => (
                    <tr key={price.platform} className={index === 0 ? 'bg-green-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-900">
                            {price.platform}
                            {index === 0 && <span className="ml-2 text-green-600">🏆</span>}
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
                        ₹{price.pricePerGram.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{(price.makingCharges * weight).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{calculateTotalCost(price).toLocaleString()}
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

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button 
            onClick={() => window.location.href = '/analysis?action=profit&weight=' + weight + '&type=' + goldType}
            className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Calculate Profit Potential
          </button>
          <button 
            onClick={() => window.location.href = '/analysis?action=growth&weight=' + weight + '&type=' + goldType}
            className="bg-white hover:bg-gray-50 text-gold-600 border-2 border-gold-500 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View Growth Analysis
          </button>
        </div>
      </div>
    </main>
  )
}