'use client'

import { useState } from 'react'
import { usePortfolio } from '@/contexts/PortfolioContext'

export default function InvestmentHistory() {
  const { investments, currentGoldPrice, currentSilverPrice, loading, removeInvestment } = usePortfolio()
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleRemoveInvestment = async (investmentId: string) => {
    if (!confirm('Are you sure you want to remove this investment? This action cannot be undone.')) {
      return
    }

    try {
      setRemovingId(investmentId)
      await removeInvestment(investmentId)
    } catch (error) {
      alert('Failed to remove investment. Please try again.')
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Investment History</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (investments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Investment History</h2>
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">📊</span>
          <p className="text-gray-600">No investments recorded yet</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getCurrentPrice = (metal: string) => {
    return metal === 'silver' ? currentSilverPrice : currentGoldPrice
  }

  const getQuantity = (investment: any) => {
    if (investment.metal === 'silver') {
      return investment.quantity || investment.silverQuantity || 0
    }
    return investment.quantity || investment.goldQuantity || 0
  }

  const calculateCurrentValue = (investment: any) => {
    const quantity = getQuantity(investment)
    const currentPrice = getCurrentPrice(investment.metal || 'gold')
    return quantity * currentPrice
  }

  const calculateReturns = (investment: any) => {
    const currentValue = calculateCurrentValue(investment)
    const returns = currentValue - investment.amount
    const percentage = (returns / investment.amount) * 100
    return { returns, percentage }
  }

  // Group investments by metal
  const goldInvestments = investments.filter(inv => !inv.metal || inv.metal === 'gold')
  const silverInvestments = investments.filter(inv => inv.metal === 'silver')

  const renderInvestmentGroup = (investmentList: any[], title: string, icon: string, currentPrice: number) => {
    if (investmentList.length === 0) return null

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="text-sm text-gray-500 ml-auto">
            Current Price: ₹{currentPrice.toLocaleString()}/g
          </div>
        </div>
        
        <div className="space-y-3">
          {investmentList.map((investment) => {
            const { returns, percentage } = calculateReturns(investment)
            const currentValue = calculateCurrentValue(investment)
            const quantity = getQuantity(investment)
            
            return (
              <div key={investment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{investment.platform}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        investment.type === 'digital' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {investment.type}
                      </span>
                      <span>{formatDate(investment.purchaseDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${
                        returns >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {returns >= 0 ? '+' : ''}₹{Math.round(returns).toLocaleString()}
                      </div>
                      <div className={`text-xs ${
                        percentage >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {percentage >= 0 ? '+' : ''}{percentage.toFixed(2)}%
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveInvestment(investment.id)}
                      disabled={removingId === investment.id}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      title="Remove Investment"
                    >
                      {removingId === investment.id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Invested</span>
                    <div className="font-semibold">₹{investment.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Quantity</span>
                    <div className="font-semibold">{quantity.toFixed(3)}g</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Purchase Price</span>
                    <div className="font-semibold">₹{investment.purchasePrice.toLocaleString()}/g</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Value</span>
                    <div className="font-semibold">₹{Math.round(currentValue).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Investment History</h2>
        <div className="text-sm text-gray-500">
          Total Investments: {investments.length}
        </div>
      </div>

      <div>
        {renderInvestmentGroup(goldInvestments, 'Gold Investments', '🥇', currentGoldPrice)}
        {renderInvestmentGroup(silverInvestments, 'Silver Investments', '🥈', currentSilverPrice)}
      </div>
    </div>
  )
}