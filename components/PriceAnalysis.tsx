'use client'

import { useState, useEffect } from 'react'
import { usePortfolio } from '@/contexts/PortfolioContext'

interface PriceAnalysisData {
  currentGoldPrice: number
  currentSilverPrice: number
  goldTrend: 'up' | 'down' | 'stable'
  silverTrend: 'up' | 'down' | 'stable'
  goldAnalysis: string
  silverAnalysis: string
  investmentRecommendation: string
}

export default function PriceAnalysis() {
  const { currentGoldPrice, currentSilverPrice, portfolio } = usePortfolio()
  const [analysis, setAnalysis] = useState<PriceAnalysisData | null>(null)

  useEffect(() => {
    generateAnalysis()
  }, [currentGoldPrice, currentSilverPrice, portfolio])

  const generateAnalysis = () => {
    // Simulate market analysis based on current prices
    const goldTrend = getGoldTrend(currentGoldPrice)
    const silverTrend = getSilverTrend(currentSilverPrice)
    
    const analysisData: PriceAnalysisData = {
      currentGoldPrice,
      currentSilverPrice,
      goldTrend,
      silverTrend,
      goldAnalysis: getGoldAnalysis(currentGoldPrice, goldTrend),
      silverAnalysis: getSilverAnalysis(currentSilverPrice, silverTrend),
      investmentRecommendation: getInvestmentRecommendation(goldTrend, silverTrend, portfolio)
    }
    
    setAnalysis(analysisData)
  }

  const getGoldTrend = (price: number): 'up' | 'down' | 'stable' => {
    // Market analysis based on current gold price ranges
    if (price > 17500) return 'up'
    if (price < 16500) return 'down'
    return 'stable'
  }

  const getSilverTrend = (price: number): 'up' | 'down' | 'stable' => {
    // Market analysis based on current silver price ranges (₹370 base)
    if (price > 380) return 'up'
    if (price < 360) return 'down'
    return 'stable'
  }

  const getGoldAnalysis = (price: number, trend: string): string => {
    if (trend === 'up') {
      return `Gold is trading at ₹${price.toLocaleString()}/g, showing strong upward momentum. This could be due to economic uncertainty or inflation concerns. Consider taking profits if you have significant holdings.`
    } else if (trend === 'down') {
      return `Gold is at ₹${price.toLocaleString()}/g, showing a downward trend. This might be a good buying opportunity for long-term investors. Market corrections often present entry points.`
    } else {
      return `Gold is stable at ₹${price.toLocaleString()}/g. This consolidation phase suggests the market is finding equilibrium. Good time for systematic investment planning.`
    }
  }

  const getSilverAnalysis = (price: number, trend: string): string => {
    if (trend === 'up') {
      return `Silver at ₹${price.toLocaleString()}/g is showing bullish behavior. Industrial demand and investment interest are driving prices higher. Monitor for profit-taking opportunities.`
    } else if (trend === 'down') {
      return `Silver has declined to ₹${price.toLocaleString()}/g, potentially offering value for new investors. Silver often follows gold but with higher volatility.`
    } else {
      return `Silver is consolidating around ₹${price.toLocaleString()}/g. This stability suggests balanced supply and demand. Consider gradual accumulation.`
    }
  }

  const getInvestmentRecommendation = (goldTrend: string, silverTrend: string, portfolioData: any): string => {
    const totalValue = portfolioData.currentValue
    const goldRatio = portfolioData.goldValue / totalValue
    const silverRatio = portfolioData.silverValue / totalValue

    if (totalValue === 0) {
      return "Start your precious metals journey! Consider allocating 70% to gold and 30% to silver for a balanced approach."
    }

    if (goldRatio > 0.8) {
      return "Your portfolio is gold-heavy. Consider diversifying with some silver investments to balance risk and capture different market opportunities."
    }

    if (silverRatio > 0.5) {
      return "High silver allocation detected. While silver has growth potential, consider rebalancing with gold for stability."
    }

    if (goldTrend === 'down' && silverTrend === 'down') {
      return "Both metals are in correction phase. This could be an excellent accumulation opportunity for long-term wealth building."
    }

    if (goldTrend === 'up' && silverTrend === 'up') {
      return "Both metals are rallying. Consider taking partial profits and maintaining core positions for continued upside."
    }

    return "Market conditions are mixed. Maintain your current allocation and consider systematic investment to average out price volatility."
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➡️'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  if (!analysis) {
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
          <span>🔍</span> Market Analysis
        </h2>
        <div className="text-sm text-gray-500">
          Updated every minute
        </div>
      </div>

      {/* Trend Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gold-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Gold Trend</h3>
            <span className="text-2xl">{getTrendIcon(analysis.goldTrend)}</span>
          </div>
          <div className={`text-lg font-bold ${getTrendColor(analysis.goldTrend)}`}>
            {analysis.goldTrend.toUpperCase()}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            ₹{analysis.currentGoldPrice.toLocaleString()}/g
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Silver Trend</h3>
            <span className="text-2xl">{getTrendIcon(analysis.silverTrend)}</span>
          </div>
          <div className={`text-lg font-bold ${getTrendColor(analysis.silverTrend)}`}>
            {analysis.silverTrend.toUpperCase()}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            ₹{analysis.currentSilverPrice.toLocaleString()}/g
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="space-y-4">
        <div className="bg-gold-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span>🥇</span> Gold Analysis
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {analysis.goldAnalysis}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span>🥈</span> Silver Analysis
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {analysis.silverAnalysis}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span>💡</span> Investment Recommendation
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {analysis.investmentRecommendation}
          </p>
        </div>
      </div>

      {/* Portfolio Impact */}
      {portfolio.currentValue > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Portfolio Impact</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Gold allocation: </span>
              <span className="font-semibold">
                {Math.round((portfolio.goldValue / portfolio.currentValue) * 100)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Silver allocation: </span>
              <span className="font-semibold">
                {Math.round((portfolio.silverValue / portfolio.currentValue) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}