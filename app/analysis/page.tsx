'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Consistent date formatting function to avoid hydration errors
const formatDate = (date: Date | string) => {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

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
  const [futureDate, setFutureDate] = useState<string>(() => {
    const future = new Date()
    future.setFullYear(future.getFullYear() + 1)
    return future.toISOString().split('T')[0]
  })
  const [targetAmount, setTargetAmount] = useState<number>(100000)
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000)
  const [expectedGrowthRate, setExpectedGrowthRate] = useState<number>(8)
  const [calculatorMode, setCalculatorMode] = useState<'future' | 'historical' | 'sip'>('future')
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'growth' | 'profit' | 'both'>('both')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
  }, [searchParams, timeFilter, investmentAmount, investmentDate, futureDate, calculatorMode, targetAmount, monthlyInvestment, expectedGrowthRate])

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
    
    if (calculatorMode === 'future') {
      // Future investment calculation - from now to future date
      const today = new Date()
      const targetDate = new Date(futureDate)
      const daysToTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      // Calculate gold amount that can be purchased today
      const gramsCanBuy = investmentAmount / currentPrice
      
      // Use user-defined growth rate
      const annualGrowthRate = expectedGrowthRate / 100
      const dailyGrowthRate = Math.pow(1 + annualGrowthRate, 1/365) - 1
      const projectedPrice = currentPrice * Math.pow(1 + dailyGrowthRate, daysToTarget)
      
      const futureValue = gramsCanBuy * projectedPrice
      const totalProfit = futureValue - investmentAmount
      
      // Create projection data for different time periods from now
      const periods = [
        { period: '3 Months', days: 90 },
        { period: '6 Months', days: 180 },
        { period: '1 Year', days: 365 },
        { period: '2 Years', days: 730 },
        { period: '3 Years', days: 1095 }
      ]

      const profitAnalysis = periods.map(({ period, days }) => {
        const projectedPriceForPeriod = currentPrice * Math.pow(1 + dailyGrowthRate, days)
        const projectedValue = gramsCanBuy * projectedPriceForPeriod
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
    } else if (calculatorMode === 'sip') {
      // SIP (Systematic Investment Plan) calculation
      const today = new Date()
      const targetDate = new Date(futureDate)
      const monthsToTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30))
      
      const annualGrowthRate = expectedGrowthRate / 100
      const monthlyGrowthRate = Math.pow(1 + annualGrowthRate, 1/12) - 1
      
      // Calculate SIP future value using compound interest formula
      let totalInvestment = 0
      let totalValue = 0
      
      for (let month = 1; month <= monthsToTarget; month++) {
        totalInvestment += monthlyInvestment
        const monthsRemaining = monthsToTarget - month + 1
        const gramsThisMonth = monthlyInvestment / currentPrice
        const futureValueThisInvestment = gramsThisMonth * currentPrice * Math.pow(1 + monthlyGrowthRate, monthsRemaining)
        totalValue += futureValueThisInvestment
      }
      
      const totalProfit = totalValue - totalInvestment
      
      // Create SIP projection data
      const periods = [
        { period: '6 Months', months: 6 },
        { period: '1 Year', months: 12 },
        { period: '2 Years', months: 24 },
        { period: '3 Years', months: 36 },
        { period: '5 Years', months: 60 }
      ]

      const profitAnalysis = periods.map(({ period, months }) => {
        let sipInvestment = 0
        let sipValue = 0
        
        for (let month = 1; month <= months; month++) {
          sipInvestment += monthlyInvestment
          const monthsRemaining = months - month + 1
          const gramsThisMonth = monthlyInvestment / currentPrice
          const futureValueThisInvestment = gramsThisMonth * currentPrice * Math.pow(1 + monthlyGrowthRate, monthsRemaining)
          sipValue += futureValueThisInvestment
        }
        
        const sipProfit = sipValue - sipInvestment
        const sipProfitPercentage = (sipProfit / sipInvestment) * 100

        return {
          period,
          investment: Math.round(sipInvestment),
          currentValue: Math.round(sipValue),
          profit: Math.round(sipProfit),
          profitPercentage: Math.round(sipProfitPercentage * 100) / 100
        }
      })

      setProfitData(profitAnalysis)
    } else {
      // Historical investment calculation - from past date to now
      const investmentPrice = 6200 // Assumed price at investment date
      const grams = investmentAmount / investmentPrice
      const currentValue = grams * currentPrice
      const profit = currentValue - investmentAmount
      
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Profit Calculator</h2>
              
              {/* Investment Strategy Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Investment Strategy
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setCalculatorMode('future')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-colors text-center ${
                      calculatorMode === 'future'
                        ? 'bg-gold-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div>🚀 Lump Sum</div>
                    <div className="text-xs mt-1">One-time investment</div>
                  </button>
                  <button
                    onClick={() => setCalculatorMode('sip')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-colors text-center ${
                      calculatorMode === 'sip'
                        ? 'bg-gold-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div>📈 SIP</div>
                    <div className="text-xs mt-1">Monthly investment</div>
                  </button>
                  <button
                    onClick={() => setCalculatorMode('historical')}
                    className={`px-4 py-3 rounded-lg font-semibold transition-colors text-center ${
                      calculatorMode === 'historical'
                        ? 'bg-gold-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div>📊 Historical</div>
                    <div className="text-xs mt-1">Past performance</div>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Common Fields */}
                {calculatorMode !== 'sip' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {calculatorMode === 'future' ? 'Investment Amount (₹)' : 'Historical Investment Amount (₹)'}
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* SIP Monthly Investment */}
                {calculatorMode === 'sip' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Investment Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Date Fields */}
                {calculatorMode === 'future' || calculatorMode === 'sip' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Future Date
                    </label>
                    <input
                      type="date"
                      value={futureDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFutureDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Date (Historical)
                    </label>
                    <input
                      type="date"
                      value={investmentDate}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setInvestmentDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Expected Growth Rate for Future Calculations */}
                {(calculatorMode === 'future' || calculatorMode === 'sip') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Annual Growth Rate (%)
                    </label>
                    <input
                      type="number"
                      value={expectedGrowthRate}
                      onChange={(e) => setExpectedGrowthRate(Number(e.target.value))}
                      min="1"
                      max="20"
                      step="0.5"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typical range: 6-12% annually</p>
                  </div>
                )}

                {/* Investment Summary */}
                <div className="bg-gold-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {calculatorMode === 'future' ? 'Future Investment Projection' : 
                     calculatorMode === 'sip' ? 'SIP Investment Summary' : 'Investment Summary'}
                  </h3>
                  
                  {calculatorMode === 'future' && isClient && (
                    <>
                      <p className="text-sm text-gray-600">
                        Gold you can buy today: ~{(investmentAmount / currentPrice).toFixed(2)} grams
                      </p>
                      <p className="text-sm text-gray-600">
                        Current gold price: ₹{currentPrice.toLocaleString()}/gram
                      </p>
                      <p className="text-sm text-gray-600">
                        Target date: {formatDate(futureDate)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Days to target: {Math.ceil((new Date(futureDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        Projected value: ₹{(() => {
                          const days = Math.ceil((new Date(futureDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                          const dailyGrowthRate = Math.pow(1 + expectedGrowthRate/100, 1/365) - 1
                          const projectedPrice = currentPrice * Math.pow(1 + dailyGrowthRate, days)
                          const gramsCanBuy = investmentAmount / currentPrice
                          return Math.round(gramsCanBuy * projectedPrice).toLocaleString()
                        })()}
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        Estimated profit: ₹{(() => {
                          const days = Math.ceil((new Date(futureDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                          const dailyGrowthRate = Math.pow(1 + expectedGrowthRate/100, 1/365) - 1
                          const projectedPrice = currentPrice * Math.pow(1 + dailyGrowthRate, days)
                          const gramsCanBuy = investmentAmount / currentPrice
                          const futureValue = gramsCanBuy * projectedPrice
                          return Math.round(futureValue - investmentAmount).toLocaleString()
                        })()}
                      </p>
                    </>
                  )}

                  {calculatorMode === 'sip' && isClient && (
                    <>
                      <p className="text-sm text-gray-600">
                        Monthly investment: ₹{monthlyInvestment.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Investment period: {Math.ceil((new Date(futureDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                      </p>
                      <p className="text-sm text-gray-600">
                        Total investment: ₹{(monthlyInvestment * Math.ceil((new Date(futureDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))).toLocaleString()}
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        Expected growth rate: {expectedGrowthRate}% annually
                      </p>
                    </>
                  )}

                  {calculatorMode === 'historical' && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {calculatorMode === 'future' ? 'Future Profit Projection' : 
                 calculatorMode === 'sip' ? 'SIP Growth Projection' : 'Historical Profit Analysis'}
              </h2>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="investment" fill="#e5e7eb" name="Investment" />
                  <Bar dataKey="currentValue" fill="#f59e0b" name={
                    calculatorMode === 'future' ? 'Projected Value' : 
                    calculatorMode === 'sip' ? 'SIP Maturity Value' : 'Current Value'
                  } />
                </BarChart>
              </ResponsiveContainer>
              
              {(calculatorMode === 'future' || calculatorMode === 'sip') && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Future projections are based on your expected growth rate of {expectedGrowthRate}% annually. 
                    Actual returns may vary based on market conditions, economic factors, and global events.
                  </p>
                </div>
              )}

              {calculatorMode === 'sip' && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>SIP Benefits:</strong> Systematic Investment Plan helps in rupee cost averaging, 
                    reducing the impact of market volatility and building wealth over time through disciplined investing.
                  </p>
                </div>
              )}
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
