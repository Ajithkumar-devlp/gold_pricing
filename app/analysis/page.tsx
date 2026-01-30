'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface GoldData {
  date: string
  price: number
  change: number
}

interface ProfitData {
  period: string
  investment: number
  currentValue: number
  profit: number
  profitPercentage: number
}

export default function AnalysisPage() {
  const searchParams = useSearchParams()
  const [timeFilter, setTimeFilter] = useState<'30d' | '6m' | '1y' | '5y'>('1y')
  const [goldData, setGoldData] = useState<GoldData[]>([])
  const [profitData, setProfitData] = useState<ProfitData[]>([])
  const [investmentAmount, setInvestmentAmount] = useState<number>(50000)
  const [investmentDate, setInvestmentDate] = useState<string>('2023-01-01')
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'growth' | 'profit' | 'both'>('both')

  useEffect(() => {
    // Handle URL parameters from compare page
    const action = searchParams.get('action')
    const weight = searchParams.get('weight')
    const type = searchParams.get('type')
    
    if (action === 'profit') {
      setActiveSection('profit')
    } else if (action === 'growth') {
      setActiveSection('growth')
    }
    
    if (weight) {
      // Convert weight to approximate investment amount (assuming ₹6200 per gram)
      setInvestmentAmount(Number(weight) * 6200)
    }
    
    fetchGoldData()
    calculateProfitAnalysis()
  }, [searchParams, timeFilter, investmentAmount, investmentDate])

  const fetchGoldData = async () => {
    setLoading(true)
    // Simulate API call - In real implementation, this would fetch actual historical data
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const generateMockData = () => {
      const data: GoldData[] = []
      const basePrice = 6500
      const periods = {
        '30d': 30,
        '6m': 180,
        '1y': 365,
        '5y': 1825
      }
      
      const days = periods[timeFilter]
      const today = new Date()
      
      for (let i = days; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        // Simulate price fluctuations with general upward trend
        const randomFactor = (Math.random() - 0.5) * 200
        const trendFactor = (days - i) * 0.5 // Slight upward trend
        const price = Math.round(basePrice + randomFactor + trendFactor)
        const change = i === days ? 0 : price - data[data.length - 1]?.price || 0
        
        data.push({
          date: date.toISOString().split('T')[0],
          price,
          change
        })
      }
      
      return data
    }
    
    setGoldData(generateMockData())
    setLoading(false)
  }

  const calculateProfitAnalysis = () => {
    const currentPrice = 6750
    const investmentPrice = 6200 // Assumed price at investment date
    const grams = investmentAmount / investmentPrice
    const currentValue = grams * currentPrice
    const profit = currentValue - investmentAmount
    const profitPercentage = (profit / investmentAmount) * 100

    const periods = [
      { period: '1 Month', days: 30 },
      { period: '3 Months', days: 90 },
      { period: '6 Months', days: 180 },
      { period: '1 Year', days: 365 },
      { period: '2 Years', days: 730 }
    ]

    const profitAnalysis = periods.map(({ period, days }) => {
      const projectedPrice = currentPrice + (days * 0.5) // Simple projection
      const projectedValue = grams * projectedPrice
      const projectedProfit = projectedValue - investmentAmount
      const projectedProfitPercentage = (projectedProfit / investmentAmount) * 100

      return {
        period,
        investment: investmentAmount,
        currentValue: Math.round(projectedValue),
        profit: Math.round(projectedProfit),
        profitPercentage: Math.round(projectedProfitPercentage * 100) / 100
      }
    })

    setProfitData(profitAnalysis)
  }

  const currentPrice = goldData.length > 0 ? goldData[goldData.length - 1].price : 6750
  const priceChange = goldData.length > 1 ? goldData[goldData.length - 1].price - goldData[goldData.length - 2].price : 0
  const changePercentage = goldData.length > 1 ? (priceChange / goldData[goldData.length - 2].price) * 100 : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AURUM Gold Growth Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Analyze historical trends and calculate profit potential
          </p>
        </div>

        {/* Current Price Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Gold Price</h3>
              <p className="text-3xl font-bold text-gold-600">₹{currentPrice.toLocaleString()}</p>
              <p className="text-sm text-gray-500">per gram</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">24h Change</h3>
              <p className={`text-3xl font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange >= 0 ? '+' : ''}₹{priceChange}
              </p>
              <p className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {changePercentage >= 0 ? '+' : ''}{changePercentage.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Market Trend</h3>
              <p className={`text-3xl font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange >= 0 ? '📈' : '📉'}
              </p>
              <p className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceChange >= 0 ? 'Bullish' : 'Bearish'}
              </p>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { key: 'both', label: 'Complete Analysis', icon: '📊' },
              { key: 'growth', label: 'Growth Analysis', icon: '📈' },
              { key: 'profit', label: 'Profit Calculator', icon: '💰' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as any)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  activeSection === key
                    ? 'bg-gold-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter - Show only for growth analysis */}
        {(activeSection === 'growth' || activeSection === 'both') && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Select Time Period</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { key: '30d', label: 'Last 30 Days' },
                { key: '6m', label: '6 Months' },
                { key: '1y', label: '1 Year' },
                { key: '5y', label: '5 Years' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTimeFilter(key as any)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    timeFilter === key
                      ? 'bg-gold-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Chart - Show only for growth analysis */}
        {(activeSection === 'growth' || activeSection === 'both') && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gold Price Trend</h2>
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={goldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [`₹${value}`, 'Price per gram']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={false}
                    name="Gold Price (₹/gram)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Profit Calculator - Show only for profit analysis */}
        {(activeSection === 'profit' || activeSection === 'both') && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profit Calculator</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Date
                  </label>
                  <input
                    type="date"
                    value={investmentDate}
                    onChange={(e) => setInvestmentDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gold-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Investment Summary</h3>
                  <p className="text-sm text-gray-600">
                    Gold purchased: ~{(investmentAmount / 6200).toFixed(2)} grams
                  </p>
                  <p className="text-sm text-gray-600">
                    Current value: ₹{((investmentAmount / 6200) * currentPrice).toLocaleString()}
                  </p>
                  <p className={`text-sm font-semibold ${
                    ((investmentAmount / 6200) * currentPrice) - investmentAmount >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    Profit/Loss: ₹{(((investmentAmount / 6200) * currentPrice) - investmentAmount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profit Projection</h2>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="investment" fill="#e5e7eb" name="Investment" />
                  <Bar dataKey="currentValue" fill="#f59e0b" name="Projected Value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Insights</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Best Time to Buy</h3>
              <p className="text-sm text-blue-700">
                Historical data suggests buying during market dips for better long-term returns.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📈 Long-term Outlook</h3>
              <p className="text-sm text-green-700">
                Gold has shown consistent growth over 5+ year periods, making it a stable investment.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">⚖️ Digital vs Physical</h3>
              <p className="text-sm text-purple-700">
                Digital gold offers better liquidity, while physical gold provides tangible security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}