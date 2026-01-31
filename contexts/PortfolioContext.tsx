'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { 
  getUserInvestments, 
  getPortfolio, 
  updatePortfolio,
  addInvestment,
  removeInvestment
} from '@/lib/firestore'
import { getCurrentMetalPrices } from '@/lib/goldPriceAPI'

interface Investment {
  id: string
  platform: string
  type: 'physical' | 'digital'
  metal: 'gold' | 'silver'
  amount: number
  quantity: number // Generic quantity (gold or silver)
  goldQuantity?: number // For backward compatibility
  silverQuantity?: number
  purchasePrice: number
  purchaseDate: string
  createdAt: any
}

interface PortfolioData {
  totalInvestment: number
  currentValue: number
  totalReturns: number
  returnsPercentage: number
  // Gold metrics
  totalGoldQuantity: number
  goldValue: number
  goldReturns: number
  goldReturnsPercentage: number
  physicalGold: number
  digitalGold: number
  // Silver metrics
  totalSilverQuantity: number
  silverValue: number
  silverReturns: number
  silverReturnsPercentage: number
  physicalSilver: number
  digitalSilver: number
  lastUpdated: string
}

interface PortfolioContextType {
  investments: Investment[]
  portfolio: PortfolioData
  loading: boolean
  currentGoldPrice: number
  currentSilverPrice: number
  priceSource: string
  lastPriceUpdate: string
  addNewInvestment: (investment: Omit<Investment, 'id' | 'createdAt'>) => Promise<void>
  removeInvestment: (investmentId: string) => Promise<void>
  refreshPortfolio: () => Promise<void>
  refreshPrices: () => Promise<void>
}

const defaultPortfolio: PortfolioData = {
  totalInvestment: 0,
  currentValue: 0,
  totalReturns: 0,
  returnsPercentage: 0,
  // Gold defaults
  totalGoldQuantity: 0,
  goldValue: 0,
  goldReturns: 0,
  goldReturnsPercentage: 0,
  physicalGold: 0,
  digitalGold: 0,
  // Silver defaults
  totalSilverQuantity: 0,
  silverValue: 0,
  silverReturns: 0,
  silverReturnsPercentage: 0,
  physicalSilver: 0,
  digitalSilver: 0,
  lastUpdated: new Date().toISOString()
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export const usePortfolio = () => {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioData>(defaultPortfolio)
  const [loading, setLoading] = useState(true)
  const [currentGoldPrice, setCurrentGoldPrice] = useState(16956)
  const [currentSilverPrice, setCurrentSilverPrice] = useState(370)
  const [priceSource, setPriceSource] = useState('loading')
  const [lastPriceUpdate, setLastPriceUpdate] = useState('')

  // Fetch real-time precious metals prices
  const fetchRealTimePrices = async () => {
    try {
      const prices = await getCurrentMetalPrices()
      setCurrentGoldPrice(prices.goldPricePerGram)
      setCurrentSilverPrice(prices.silverPricePerGram)
      setPriceSource(prices.source)
      setLastPriceUpdate(prices.lastUpdated)
      
      console.log('Updated prices:', {
        gold: prices.goldPricePerGram,
        silver: prices.silverPricePerGram,
        source: prices.source
      })
    } catch (error) {
      console.error('Error fetching real-time prices:', error)
      // Keep existing prices if fetch fails
    }
  }

  // Initial price fetch
  useEffect(() => {
    fetchRealTimePrices()
  }, [])

  // Set up real-time price updates every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealTimePrices()
    }, 60 * 1000) // Update every minute for real-time analysis

    return () => clearInterval(interval)
  }, [])

  // Load user investments and calculate portfolio
  useEffect(() => {
    if (user) {
      loadPortfolioData()
    } else {
      setInvestments([])
      setPortfolio(defaultPortfolio)
      setLoading(false)
    }
  }, [user])

  // Recalculate portfolio when prices change
  useEffect(() => {
    if (investments.length > 0) {
      calculatePortfolio(investments)
    }
  }, [currentGoldPrice, currentSilverPrice, investments])

  const loadPortfolioData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const userInvestments = await getUserInvestments(user.uid)
      setInvestments(userInvestments as Investment[])
      
      if (userInvestments.length > 0) {
        calculatePortfolio(userInvestments as Investment[])
      }
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePortfolio = async (investmentData: Investment[]) => {
    const totalInvestment = investmentData.reduce((sum, inv) => sum + inv.amount, 0)
    
    // Separate gold and silver investments
    const goldInvestments = investmentData.filter(inv => inv.metal === 'gold' || !inv.metal) // Backward compatibility
    const silverInvestments = investmentData.filter(inv => inv.metal === 'silver')
    
    // Calculate gold metrics
    const totalGoldQuantity = goldInvestments.reduce((sum, inv) => {
      return sum + (inv.quantity || inv.goldQuantity || 0)
    }, 0)
    const goldInvestmentAmount = goldInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    const goldValue = totalGoldQuantity * currentGoldPrice
    const goldReturns = goldValue - goldInvestmentAmount
    const goldReturnsPercentage = goldInvestmentAmount > 0 ? (goldReturns / goldInvestmentAmount) * 100 : 0
    
    const physicalGold = goldInvestments
      .filter(inv => inv.type === 'physical')
      .reduce((sum, inv) => sum + (inv.quantity || inv.goldQuantity || 0), 0)
    
    const digitalGold = goldInvestments
      .filter(inv => inv.type === 'digital')
      .reduce((sum, inv) => sum + (inv.quantity || inv.goldQuantity || 0), 0)

    // Calculate silver metrics
    const totalSilverQuantity = silverInvestments.reduce((sum, inv) => {
      return sum + (inv.quantity || inv.silverQuantity || 0)
    }, 0)
    const silverInvestmentAmount = silverInvestments.reduce((sum, inv) => sum + inv.amount, 0)
    const silverValue = totalSilverQuantity * currentSilverPrice
    const silverReturns = silverValue - silverInvestmentAmount
    const silverReturnsPercentage = silverInvestmentAmount > 0 ? (silverReturns / silverInvestmentAmount) * 100 : 0
    
    const physicalSilver = silverInvestments
      .filter(inv => inv.type === 'physical')
      .reduce((sum, inv) => sum + (inv.quantity || inv.silverQuantity || 0), 0)
    
    const digitalSilver = silverInvestments
      .filter(inv => inv.type === 'digital')
      .reduce((sum, inv) => sum + (inv.quantity || inv.silverQuantity || 0), 0)

    // Calculate total portfolio metrics
    const currentValue = goldValue + silverValue
    const totalReturns = currentValue - totalInvestment
    const returnsPercentage = totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0

    const portfolioData: PortfolioData = {
      totalInvestment,
      currentValue: Math.round(currentValue),
      totalReturns: Math.round(totalReturns),
      returnsPercentage: Math.round(returnsPercentage * 100) / 100,
      // Gold metrics
      totalGoldQuantity: Math.round(totalGoldQuantity * 1000) / 1000,
      goldValue: Math.round(goldValue),
      goldReturns: Math.round(goldReturns),
      goldReturnsPercentage: Math.round(goldReturnsPercentage * 100) / 100,
      physicalGold: Math.round(physicalGold * 1000) / 1000,
      digitalGold: Math.round(digitalGold * 1000) / 1000,
      // Silver metrics
      totalSilverQuantity: Math.round(totalSilverQuantity * 1000) / 1000,
      silverValue: Math.round(silverValue),
      silverReturns: Math.round(silverReturns),
      silverReturnsPercentage: Math.round(silverReturnsPercentage * 100) / 100,
      physicalSilver: Math.round(physicalSilver * 1000) / 1000,
      digitalSilver: Math.round(digitalSilver * 1000) / 1000,
      lastUpdated: new Date().toISOString()
    }

    setPortfolio(portfolioData)

    // Update portfolio in Firestore
    if (user) {
      try {
        await updatePortfolio(user.uid, portfolioData)
      } catch (error) {
        console.error('Error updating portfolio:', error)
      }
    }
  }

  const addNewInvestment = async (investmentData: Omit<Investment, 'id' | 'createdAt'>) => {
    if (!user) return

    try {
      const investmentId = await addInvestment(user.uid, investmentData)
      const newInvestment = {
        ...investmentData,
        id: investmentId,
        createdAt: new Date()
      }
      
      const updatedInvestments = [...investments, newInvestment]
      setInvestments(updatedInvestments)
      calculatePortfolio(updatedInvestments)
    } catch (error) {
      console.error('Error adding investment:', error)
      throw error
    }
  }

  const removeInvestmentFromPortfolio = async (investmentId: string) => {
    if (!user) return

    try {
      await removeInvestment(user.uid, investmentId)
      const updatedInvestments = investments.filter(inv => inv.id !== investmentId)
      setInvestments(updatedInvestments)
      calculatePortfolio(updatedInvestments)
    } catch (error) {
      console.error('Error removing investment:', error)
      throw error
    }
  }

  const refreshPrices = async () => {
    await fetchRealTimePrices()
  }

  const refreshPortfolio = async () => {
    await loadPortfolioData()
  }

  const value: PortfolioContextType = {
    investments,
    portfolio,
    loading,
    currentGoldPrice,
    currentSilverPrice,
    priceSource,
    lastPriceUpdate,
    addNewInvestment,
    removeInvestment: removeInvestmentFromPortfolio,
    refreshPortfolio,
    refreshPrices
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}