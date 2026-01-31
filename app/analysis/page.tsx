'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePlatformPrices } from '@/contexts/PlatformPricesContext'
import { usePortfolio } from '@/contexts/PortfolioContext'

interface MarketAnalysis {
  goldTrend: 'bullish' | 'bearish' | 'neutral'
  silverTrend: 'bullish' | 'bearish' | 'neutral'
  recommendation: string
  riskLevel: 'low' | 'medium' | 'high'
}

interface SIPProjection {
  month: number
  investment: number
  goldQuantity: number
  silverQuantity: number
  projectedValue: number
  profit: number
  profitPercentage: number
}

interface SingleInvestmentAnalysis {
  amount: number
  goldWeight: number
  silverWeight: number
  currentValue: number
  profit: number
  profitPercentage: number
  breakEvenPrice: number
}

export default function AnalysisPage() {
  const searchParams = useSearchParams()
  const { 
    baseGoldPrice: realTimeGoldPrice, 
    baseSilverPrice: realTimeSilverPrice,
    getBestGoldDeals,
    getBestSilverDeals
  } = usePlatformPrices()
  
  const { portfolio, currentGoldPrice, currentSilverPrice } = usePortfolio()
  
  const [activeSection, setActiveSection] = useState<'market' | 'sip' | 'single' | 'portfolio' | 'comparison'>('market')
  
  // SIP Analysis States
  const [sipAmount, setSipAmount] = useState(5000)
  const [sipDuration, setSipDuration] = useState(12)
  const [sipMetalType, setSipMetalType] = useState<'both' | 'gold' | 'silver'>('both')
  const [sipProjections, setSipProjections] = useState<SIPProjection[]>([])
  
  // Single Investment States
  const [singleAmount, setSingleAmount] = useState(50000)
  const [singleMetalType, setSingleMetalType] = useState<'gold' | 'silver'>('gold')
  const [singleAnalysis, setSingleAnalysis] = useState<SingleInvestmentAnalysis | null>(null)
  
  // Market Analysis
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null)

  useEffect(() => {
    generateMarketAnalysis()
    calculateSIPProjections()
    calculateSingleInvestmentAnalysis()
  }, [realTimeGoldPrice, realTimeSilverPrice, sipAmount, sipDuration, sipMetalType, singleAmount, singleMetalType])

  const generateMarketAnalysis = () => {
    const goldPrice = realTimeGoldPrice || currentGoldPrice
    const silverPrice = realTimeSilverPrice || currentSilverPrice
    
    // Simple trend analysis based on price levels
    const goldTrend = goldPrice > 17000 ? 'bullish' : goldPrice < 16500 ? 'bearish' : 'neutral'
    const silverTrend = silverPrice > 380 ? 'bullish' : silverPrice < 360 ? 'bearish' : 'neutral'
    
    let recommendation = ''
    let riskLevel: 'low' | 'medium' | 'high' = 'medium'
    
    if (goldTrend === 'bullish' && silverTrend === 'bullish') {
      recommendation = 'Strong market conditions. Consider increasing investments in both metals.'
      riskLevel = 'low'
    } else if (goldTrend === 'bearish' && silverTrend === 'bearish') {
      recommendation = 'Market correction phase. Excellent opportunity for SIP investments.'
      riskLevel = 'high'
    } else {
      recommendation = 'Mixed market signals. Maintain balanced portfolio with regular SIP.'
      riskLevel = 'medium'
    }
    
    setMarketAnalysis({ goldTrend, silverTrend, recommendation, riskLevel })
  }

  const calculateSIPProjections = () => {
    const goldPrice = realTimeGoldPrice || currentGoldPrice
    const silverPrice = realTimeSilverPrice || currentSilverPrice
    
    const projections: SIPProjection[] = []
    let totalInvestment = 0
    let totalGoldQuantity = 0
    let totalSilverQuantity = 0
    
    // Projected annual growth rates
    const goldGrowthRate = 0.10 // 10% annual
    const silverGrowthRate = 0.15 // 15% annual
    
    for (let month = 1; month <= sipDuration; month++) {
      totalInvestment += sipAmount
      
      // Calculate allocation based on metal type
      let goldInvestment = 0
      let silverInvestment = 0
      
      if (sipMetalType === 'gold') {
        goldInvestment = sipAmount
      } else if (sipMetalType === 'silver') {
        silverInvestment = sipAmount
      } else {
        goldInvestment = sipAmount * 0.6
        silverInvestment = sipAmount * 0.4
      }
      
      // Calculate quantities purchased this month
      const monthlyGoldQuantity = goldInvestment / goldPrice
      const monthlySilverQuantity = silverInvestment / silverPrice
      
      totalGoldQuantity += monthlyGoldQuantity
      totalSilverQuantity += monthlySilverQuantity
      
      // Project future prices
      const monthsFromNow = month
      const projectedGoldPrice = goldPrice * Math.pow(1 + goldGrowthRate / 12, monthsFromNow)
      const projectedSilverPrice = silverPrice * Math.pow(1 + silverGrowthRate / 12, monthsFromNow)
      
      const projectedValue = (totalGoldQuantity * projectedGoldPrice) + (totalSilverQuantity * projectedSilverPrice)
      const profit = projectedValue - totalInvestment
      const profitPercentage = (profit / totalInvestment) * 100
      
      projections.push({
        month,
        investment: totalInvestment,
        goldQuantity: totalGoldQuantity,
        silverQuantity: totalSilverQuantity,
        projectedValue: Math.round(projectedValue),
        profit: Math.round(profit),
        profitPercentage: Math.round(profitPercentage * 100) / 100
      })
    }
    
    setSipProjections(projections)
  }

  const calculateSingleInvestmentAnalysis = () => {
    const goldPrice = realTimeGoldPrice || currentGoldPrice
    const silverPrice = realTimeSilverPrice || currentSilverPrice
    
    const price = singleMetalType === 'gold' ? goldPrice : silverPrice
    const weight = singleAmount / price
    
    // Project 6-month value
    const growthRate = singleMetalType === 'gold' ? 0.10 : 0.15
    const projectedPrice = price * Math.pow(1 + growthRate, 0.5) // 6 months
    const currentValue = weight * projectedPrice
    const profit = currentValue - singleAmount
    const profitPercentage = (profit / singleAmount) * 100
    
    // Break-even calculation
    const breakEvenPrice = singleAmount / weight
    
    const analysis: SingleInvestmentAnalysis = {
      amount: singleAmount,
      goldWeight: singleMetalType === 'gold' ? weight : 0,
      silverWeight: singleMetalType === 'silver' ? weight : 0,
      currentValue: Math.round(currentValue),
      profit: Math.round(profit),
      profitPercentage: Math.round(profitPercentage * 100) / 100,
      breakEvenPrice: Math.round(breakEvenPrice)
    }
    
    setSingleAnalysis(analysis)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return '📈'
      case 'bearish': return '📉'
      default: return '➡️'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-green-600'
      case 'bearish': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 px-4">
            AURUM Investment Analysis
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">
            Comprehensive Analysis Tools for Smart Investment Decisions
          </p>
        </div>

        {/* Current Prices Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Gold (Au)</h3>
              <span className="text-xl sm:text-2xl">🥇</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gold-600">₹{(realTimeGoldPrice || currentGoldPrice).toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-500">per gram</p>
              </div>
              <div className="text-right">
                {marketAnalysis && (
                  <div className={`text-base sm:text-lg font-bold ${getTrendColor(marketAnalysis.goldTrend)}`}>
                    {getTrendIcon(marketAnalysis.goldTrend)} {marketAnalysis.goldTrend.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Silver (Ag)</h3>
              <span className="text-xl sm:text-2xl">🥈</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-600">₹{(realTimeSilverPrice || currentSilverPrice).toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-500">per gram</p>
              </div>
              <div className="text-right">
                {marketAnalysis && (
                  <div className={`text-base sm:text-lg font-bold ${getTrendColor(marketAnalysis.silverTrend)}`}>
                    {getTrendIcon(marketAnalysis.silverTrend)} {marketAnalysis.silverTrend.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Controls */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Analysis Type</label>
            
            {/* Mobile: Vertical Stack */}
            <div className="block sm:hidden space-y-2">
              {[
                { key: 'market', label: 'Market Analysis', icon: '📊' },
                { key: 'sip', label: 'SIP Analysis', icon: '💰' },
                { key: 'single', label: 'Single Investment', icon: '💎' },
                { key: 'portfolio', label: 'Portfolio Review', icon: '📈' },
                { key: 'comparison', label: 'Platform Compare', icon: '🔍' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key as any)}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-3 text-base touch-manipulation ${
                    activeSection === key
                      ? 'bg-gold-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                  {activeSection === key && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Desktop: Horizontal Grid */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-5 gap-2">
              {[
                { key: 'market', label: 'Market Analysis', icon: '📊' },
                { key: 'sip', label: 'SIP Analysis', icon: '💰' },
                { key: 'single', label: 'Single Investment', icon: '💎' },
                { key: 'portfolio', label: 'Portfolio Review', icon: '📈' },
                { key: 'comparison', label: 'Platform Compare', icon: '🔍' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key as any)}
                  className={`px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1 text-sm ${
                    activeSection === key
                      ? 'bg-gold-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{icon}</span>
                  <span className="hidden lg:inline">{label}</span>
                  <span className="lg:hidden">{label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Market Analysis Section */}
        {activeSection === 'market' && marketAnalysis && (
          <div className="space-y-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Analysis & Recommendations</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(marketAnalysis.riskLevel)}`}>
                    Risk Level: {marketAnalysis.riskLevel.toUpperCase()}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getTrendColor(marketAnalysis.goldTrend)}`}>
                    Gold: {getTrendIcon(marketAnalysis.goldTrend)} {marketAnalysis.goldTrend.toUpperCase()}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getTrendColor(marketAnalysis.silverTrend)}`}>
                    Silver: {getTrendIcon(marketAnalysis.silverTrend)} {marketAnalysis.silverTrend.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Investment Recommendation</h3>
                <p className="text-blue-700">{marketAnalysis.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* SIP Analysis Section */}
        {activeSection === 'sip' && (
          <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* SIP Configuration */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">SIP Analysis Configuration</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly SIP Amount (₹)</label>
                    <input
                      type="number"
                      value={sipAmount}
                      onChange={(e) => setSipAmount(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-base"
                      min="1000"
                      step="500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Months)</label>
                    <input
                      type="number"
                      value={sipDuration}
                      onChange={(e) => setSipDuration(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-base"
                      min="6"
                      max="60"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metal Preference</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'both', label: 'Both', icon: '🥇🥈' },
                        { key: 'gold', label: 'Gold Only', icon: '🥇' },
                        { key: 'silver', label: 'Silver Only', icon: '🥈' }
                      ].map(({ key, label, icon }) => (
                        <button
                          key={key}
                          onClick={() => setSipMetalType(key as any)}
                          className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 text-sm justify-center ${
                            sipMetalType === key
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
                </div>
              </div>

              {/* SIP Projections */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">SIP Projections</h2>
                
                {sipProjections.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <div className="text-xs sm:text-sm text-blue-600">Total Investment</div>
                        <div className="text-lg sm:text-xl font-bold text-blue-800">₹{sipProjections[sipProjections.length - 1]?.investment.toLocaleString()}</div>
                      </div>
                      <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                        <div className="text-xs sm:text-sm text-green-600">Projected Value</div>
                        <div className="text-lg sm:text-xl font-bold text-green-800">₹{sipProjections[sipProjections.length - 1]?.projectedValue.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                        <div className="text-xs sm:text-sm text-purple-600">Expected Profit</div>
                        <div className="text-lg sm:text-xl font-bold text-purple-800">₹{sipProjections[sipProjections.length - 1]?.profit.toLocaleString()}</div>
                      </div>
                      <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                        <div className="text-xs sm:text-sm text-orange-600">Return %</div>
                        <div className="text-lg sm:text-xl font-bold text-orange-800">{sipProjections[sipProjections.length - 1]?.profitPercentage}%</div>
                      </div>
                    </div>
                    
                    {sipMetalType !== 'silver' && (
                      <div className="bg-gold-50 p-3 sm:p-4 rounded-lg">
                        <div className="text-xs sm:text-sm text-gold-600">Gold Accumulated</div>
                        <div className="text-base sm:text-lg font-bold text-gold-800">{sipProjections[sipProjections.length - 1]?.goldQuantity.toFixed(3)}g</div>
                      </div>
                    )}
                    
                    {sipMetalType !== 'gold' && (
                      <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                        <div className="text-xs sm:text-sm text-slate-600">Silver Accumulated</div>
                        <div className="text-base sm:text-lg font-bold text-slate-800">{sipProjections[sipProjections.length - 1]?.silverQuantity.toFixed(3)}g</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Single Investment Analysis */}
        {activeSection === 'single' && (
          <div className="space-y-8 mb-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Single Investment Configuration */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Single Investment Analysis</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount (₹)</label>
                    <input
                      type="number"
                      value={singleAmount}
                      onChange={(e) => setSingleAmount(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      min="10000"
                      step="5000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metal Choice</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'gold', label: 'Gold', icon: '🥇' },
                        { key: 'silver', label: 'Silver', icon: '🥈' }
                      ].map(({ key, label, icon }) => (
                        <button
                          key={key}
                          onClick={() => setSingleMetalType(key as any)}
                          className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            singleMetalType === key
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
                </div>
              </div>

              {/* Single Investment Results */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Analysis Results</h2>
                
                {singleAnalysis && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600">Investment Amount</div>
                        <div className="text-xl font-bold text-blue-800">₹{singleAnalysis.amount.toLocaleString()}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600">6-Month Projection</div>
                        <div className="text-xl font-bold text-green-800">₹{singleAnalysis.currentValue.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-purple-600">Expected Profit</div>
                        <div className="text-xl font-bold text-purple-800">₹{singleAnalysis.profit.toLocaleString()}</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm text-orange-600">Return %</div>
                        <div className="text-xl font-bold text-orange-800">{singleAnalysis.profitPercentage}%</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">
                        {singleMetalType === 'gold' ? 'Gold Weight' : 'Silver Weight'}
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {singleMetalType === 'gold' 
                          ? `${singleAnalysis.goldWeight.toFixed(3)}g` 
                          : `${singleAnalysis.silverWeight.toFixed(3)}g`
                        }
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-sm text-yellow-600">Break-even Price</div>
                      <div className="text-lg font-bold text-yellow-800">₹{singleAnalysis.breakEvenPrice.toLocaleString()}/g</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Analysis */}
        {activeSection === 'portfolio' && (
          <div className="space-y-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Portfolio Analysis</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600">Total Investment</div>
                  <div className="text-xl font-bold text-blue-800">₹{portfolio.totalInvestment.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">Current Value</div>
                  <div className="text-xl font-bold text-green-800">₹{portfolio.currentValue.toLocaleString()}</div>
                </div>
                <div className={`p-4 rounded-lg ${portfolio.totalReturns >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <div className={`text-sm ${portfolio.totalReturns >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Total Returns</div>
                  <div className={`text-xl font-bold ${portfolio.totalReturns >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                    {portfolio.totalReturns >= 0 ? '+' : ''}₹{Math.abs(portfolio.totalReturns).toLocaleString()}
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${portfolio.returnsPercentage >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <div className={`text-sm ${portfolio.returnsPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Return %</div>
                  <div className={`text-xl font-bold ${portfolio.returnsPercentage >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                    {portfolio.returnsPercentage >= 0 ? '+' : ''}{portfolio.returnsPercentage}%
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gold-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gold-800 mb-3">Gold Holdings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gold-600">Quantity:</span>
                      <span className="font-bold text-gold-800">{portfolio.totalGoldQuantity}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-600">Value:</span>
                      <span className="font-bold text-gold-800">₹{portfolio.goldValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-600">Returns:</span>
                      <span className={`font-bold ${portfolio.goldReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {portfolio.goldReturns >= 0 ? '+' : ''}₹{Math.abs(portfolio.goldReturns).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Silver Holdings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Quantity:</span>
                      <span className="font-bold text-slate-800">{portfolio.totalSilverQuantity}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Value:</span>
                      <span className="font-bold text-slate-800">₹{portfolio.silverValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Returns:</span>
                      <span className={`font-bold ${portfolio.silverReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {portfolio.silverReturns >= 0 ? '+' : ''}₹{Math.abs(portfolio.silverReturns).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Comparison */}
        {activeSection === 'comparison' && (
          <div className="space-y-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Comparison Analysis</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Best Gold Platforms */}
                <div>
                  <h3 className="text-lg font-semibold text-gold-800 mb-4">🥇 Best Gold Platforms</h3>
                  <div className="space-y-3">
                    {getBestGoldDeals().slice(0, 5).map((platform, index) => (
                      <div key={platform.platform} className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gold-800">{platform.platform}</div>
                          <div className="text-sm text-gold-600">{platform.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gold-800">₹{platform.goldPricePerGram.toLocaleString()}/g</div>
                          <div className="text-xs text-gold-600">
                            {platform.goldMakingCharges > 0 ? `+₹${platform.goldMakingCharges}/g` : 'No charges'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Best Silver Platforms */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">🥈 Best Silver Platforms</h3>
                  <div className="space-y-3">
                    {getBestSilverDeals().slice(0, 5).map((platform, index) => (
                      <div key={platform.platform} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800">{platform.platform}</div>
                          <div className="text-sm text-slate-600">{platform.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800">₹{platform.silverPricePerGram.toLocaleString()}/g</div>
                          <div className="text-xs text-slate-600">
                            {platform.silverMakingCharges > 0 ? `+₹${platform.silverMakingCharges}/g` : 'No charges'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investment Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Insights & Tips</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">💡 SIP Strategy</h3>
              <p className="text-sm text-blue-700">
                Systematic Investment Plans help average out price volatility and build wealth gradually through disciplined investing.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📈 Single Investment</h3>
              <p className="text-sm text-green-700">
                Lump sum investments work best during market corrections. Monitor price trends for optimal entry points.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">⚖️ Portfolio Mix</h3>
              <p className="text-sm text-purple-700">
                Maintain 60-70% gold and 30-40% silver allocation for balanced risk-return profile in precious metals portfolio.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">🎯 Long-term View</h3>
              <p className="text-sm text-orange-700">
                Historical data shows precious metals deliver superior returns over 5+ year periods, making them ideal for long-term wealth creation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}