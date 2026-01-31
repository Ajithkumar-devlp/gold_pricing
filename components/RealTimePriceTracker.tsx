'use client'

import { useState, useEffect } from 'react'
import { usePortfolio } from '@/contexts/PortfolioContext'

interface PriceHistory {
  timestamp: string
  goldPrice: number
  silverPrice: number
  goldChange: number
  silverChange: number
}

export default function RealTimePriceTracker() {
  const { 
    currentGoldPrice, 
    currentSilverPrice, 
    lastPriceUpdate, 
    priceSource 
  } = usePortfolio()
  
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])
  const [previousGoldPrice, setPreviousGoldPrice] = useState<number | null>(null)
  const [previousSilverPrice, setPreviousSilverPrice] = useState<number | null>(null)

  // Track actual real-time price changes only
  useEffect(() => {
    // Only track changes if we have previous prices to compare with
    if (previousGoldPrice !== null && previousSilverPrice !== null) {
      const goldChange = currentGoldPrice - previousGoldPrice
      const silverChange = currentSilverPrice - previousSilverPrice
      
      // Only add to history if there's an actual change
      if (goldChange !== 0 || silverChange !== 0) {
        const newEntry: PriceHistory = {
          timestamp: new Date().toISOString(),
          goldPrice: currentGoldPrice,
          silverPrice: currentSilverPrice,
          goldChange,
          silverChange
        }
        
        setPriceHistory(prev => {
          const updated = [newEntry, ...prev].slice(0, 20) // Keep last 20 real updates
          return updated
        })
      }
    }
    
    // Update previous prices for next comparison
    setPreviousGoldPrice(currentGoldPrice)
    setPreviousSilverPrice(currentSilverPrice)
  }, [currentGoldPrice, currentSilverPrice])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatChange = (change: number, isGold: boolean = true) => {
    if (change === 0) return '—'
    const color = change > 0 ? 'text-green-600' : 'text-red-600'
    const symbol = change > 0 ? '+' : ''
    return (
      <span className={color}>
        {symbol}₹{Math.abs(change).toFixed(isGold ? 0 : 2)}
      </span>
    )
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'gold-api-com':
      case 'metals-api-com':
      case 'commodities-api-com':
        return '🟢'
      case 'market-based-simulation':
        return '🟡'
      default:
        return '⚪'
    }
  }

  const getLatestChange = (type: 'gold' | 'silver') => {
    if (priceHistory.length === 0) return '—'
    const latest = priceHistory[0]
    return type === 'gold' ? formatChange(latest.goldChange) : formatChange(latest.silverChange, false)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>📊</span> Real-Time Price Tracker
        </h2>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <span>{getSourceIcon(priceSource)}</span>
          <span>Updates every minute</span>
        </div>
      </div>

      {/* Current Prices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gold-50 p-3 sm:p-4 rounded-lg border border-gold-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-xs sm:text-sm text-gold-600">Gold Price</div>
              <div className="text-xl sm:text-2xl font-bold text-gold-700">
                ₹{currentGoldPrice.toLocaleString()}/g
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-gold-500">Change</div>
              <div className="text-base sm:text-lg font-semibold">
                {getLatestChange('gold')}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-xs sm:text-sm text-slate-600">Silver Price</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-700">
                ₹{currentSilverPrice.toLocaleString()}/g
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-500">Change</div>
              <div className="text-base sm:text-lg font-semibold">
                {getLatestChange('silver')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Price History */}
      {priceHistory.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Price Changes</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {priceHistory.map((entry, index) => (
              <div key={entry.timestamp} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  {formatTime(entry.timestamp)}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Gold: </span>
                    <span className="font-semibold">₹{entry.goldPrice.toLocaleString()}</span>
                    <span className="ml-2">{formatChange(entry.goldChange)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Silver: </span>
                    <span className="font-semibold">₹{entry.silverPrice.toLocaleString()}</span>
                    <span className="ml-2">{formatChange(entry.silverChange, false)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⏱️</div>
          <p className="text-gray-600 mb-2">Waiting for real-time price changes...</p>
          <p className="text-sm text-gray-500">Price changes will appear here as they happen</p>
        </div>
      )}

      {/* Last Update Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Last updated: {formatTime(lastPriceUpdate || new Date().toISOString())}</span>
          <span>Source: {priceSource.replace(/-/g, ' ').toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}