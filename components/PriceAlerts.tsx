'use client'

import { useState, useEffect } from 'react'
import { usePortfolio } from '@/contexts/PortfolioContext'

interface PriceAlert {
  id: string
  type: 'gold' | 'silver'
  message: string
  timestamp: string
  severity: 'info' | 'warning' | 'success'
  change: number
}

export default function PriceAlerts() {
  const { currentGoldPrice, currentSilverPrice } = usePortfolio()
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [previousGoldPrice, setPreviousGoldPrice] = useState(currentGoldPrice)
  const [previousSilverPrice, setPreviousSilverPrice] = useState(currentSilverPrice)

  useEffect(() => {
    checkForSignificantChanges()
  }, [currentGoldPrice, currentSilverPrice])

  const checkForSignificantChanges = () => {
    const goldChange = currentGoldPrice - previousGoldPrice
    const silverChange = currentSilverPrice - previousSilverPrice
    
    // Check for significant gold price changes (>₹50 or >0.3%)
    if (Math.abs(goldChange) > 50 || Math.abs(goldChange / previousGoldPrice) > 0.003) {
      const alert: PriceAlert = {
        id: `gold-${Date.now()}`,
        type: 'gold',
        message: `Gold price ${goldChange > 0 ? 'increased' : 'decreased'} by ₹${Math.abs(goldChange).toFixed(0)} to ₹${currentGoldPrice.toLocaleString()}/g`,
        timestamp: new Date().toISOString(),
        severity: Math.abs(goldChange) > 100 ? 'warning' : 'info',
        change: goldChange
      }
      addAlert(alert)
    }

    // Check for significant silver price changes (>₹5 or >1.5%)
    if (Math.abs(silverChange) > 5 || Math.abs(silverChange / previousSilverPrice) > 0.015) {
      const alert: PriceAlert = {
        id: `silver-${Date.now()}`,
        type: 'silver',
        message: `Silver price ${silverChange > 0 ? 'increased' : 'decreased'} by ₹${Math.abs(silverChange).toFixed(2)} to ₹${currentSilverPrice.toLocaleString()}/g`,
        timestamp: new Date().toISOString(),
        severity: Math.abs(silverChange) > 10 ? 'warning' : 'info',
        change: silverChange
      }
      addAlert(alert)
    }

    setPreviousGoldPrice(currentGoldPrice)
    setPreviousSilverPrice(currentSilverPrice)
  }

  const addAlert = (alert: PriceAlert) => {
    setAlerts(prev => {
      const updated = [alert, ...prev].slice(0, 5) // Keep only last 5 alerts
      return updated
    })

    // Auto-remove alert after 30 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== alert.id))
    }, 30000)
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const getAlertIcon = (type: string, change: number) => {
    if (type === 'gold') {
      return change > 0 ? '🥇📈' : '🥇📉'
    } else {
      return change > 0 ? '🥈📈' : '🥈📉'
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      default: return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border shadow-lg transition-all duration-300 ${getAlertColor(alert.severity)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <span className="text-lg">{getAlertIcon(alert.type, alert.change)}</span>
              <div>
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs opacity-75 mt-1">{formatTime(alert.timestamp)}</p>
              </div>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}