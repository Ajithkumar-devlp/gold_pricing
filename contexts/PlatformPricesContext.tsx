'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  getCachedPlatformPrices, 
  PlatformPricesResponse, 
  PlatformPrice,
  getBestDeals,
  getPriceAnalysis,
  calculateTotalCost
} from '@/lib/platformPricesAPI'

interface PlatformPricesContextType {
  platformPrices: PlatformPrice[]
  baseGoldPrice: number
  baseSilverPrice: number
  lastUpdated: string
  source: string
  loading: boolean
  refreshPlatformPrices: () => Promise<void>
  getBestGoldDeals: (type?: 'physical' | 'digital') => PlatformPrice[]
  getBestSilverDeals: (type?: 'physical' | 'digital') => PlatformPrice[]
  getGoldAnalysis: () => any
  getSilverAnalysis: () => any
  calculatePlatformCost: (platform: PlatformPrice, metal: 'gold' | 'silver', weight: number) => number
  getFilteredPlatforms: (type?: 'physical' | 'digital', metal?: 'gold' | 'silver') => PlatformPrice[]
}

const PlatformPricesContext = createContext<PlatformPricesContextType | undefined>(undefined)

export const usePlatformPrices = () => {
  const context = useContext(PlatformPricesContext)
  if (context === undefined) {
    throw new Error('usePlatformPrices must be used within a PlatformPricesProvider')
  }
  return context
}

export const PlatformPricesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [platformPrices, setPlatformPrices] = useState<PlatformPrice[]>([])
  const [baseGoldPrice, setBaseGoldPrice] = useState(16956)
  const [baseSilverPrice, setBaseSilverPrice] = useState(370)
  const [lastUpdated, setLastUpdated] = useState('')
  const [source, setSource] = useState('loading')
  const [loading, setLoading] = useState(true)

  // Fetch platform prices
  const fetchPlatformPrices = async () => {
    try {
      const prices = await getCachedPlatformPrices()
      setPlatformPrices(prices.platforms)
      setBaseGoldPrice(prices.baseGoldPrice)
      setBaseSilverPrice(prices.baseSilverPrice)
      setLastUpdated(prices.lastUpdated)
      setSource(prices.source)
      
      console.log('Updated platform prices:', {
        platformCount: prices.platforms.length,
        baseGold: prices.baseGoldPrice,
        baseSilver: prices.baseSilverPrice,
        source: prices.source
      })
    } catch (error) {
      console.error('Error fetching platform prices:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPlatformPrices()
  }, [])

  // Set up real-time updates every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPlatformPrices()
    }, 60 * 1000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Helper functions
  const getBestGoldDeals = (type?: 'physical' | 'digital') => {
    return getBestDeals(platformPrices, 'gold', type)
  }

  const getBestSilverDeals = (type?: 'physical' | 'digital') => {
    return getBestDeals(platformPrices, 'silver', type)
  }

  const getGoldAnalysis = () => {
    return getPriceAnalysis(platformPrices, 'gold')
  }

  const getSilverAnalysis = () => {
    return getPriceAnalysis(platformPrices, 'silver')
  }

  const calculatePlatformCost = (platform: PlatformPrice, metal: 'gold' | 'silver', weight: number) => {
    return calculateTotalCost(platform, metal, weight)
  }

  const getFilteredPlatforms = (type?: 'physical' | 'digital', metal?: 'gold' | 'silver') => {
    let filtered = platformPrices

    if (type) {
      filtered = filtered.filter(p => p.type === type)
    }

    // Sort by the relevant metal price
    if (metal === 'gold') {
      filtered = filtered.sort((a, b) => a.goldPricePerGram - b.goldPricePerGram)
    } else if (metal === 'silver') {
      filtered = filtered.sort((a, b) => a.silverPricePerGram - b.silverPricePerGram)
    }

    return filtered
  }

  const refreshPlatformPrices = async () => {
    setLoading(true)
    await fetchPlatformPrices()
  }

  const value: PlatformPricesContextType = {
    platformPrices,
    baseGoldPrice,
    baseSilverPrice,
    lastUpdated,
    source,
    loading,
    refreshPlatformPrices,
    getBestGoldDeals,
    getBestSilverDeals,
    getGoldAnalysis,
    getSilverAnalysis,
    calculatePlatformCost,
    getFilteredPlatforms
  }

  return (
    <PlatformPricesContext.Provider value={value}>
      {children}
    </PlatformPricesContext.Provider>
  )
}