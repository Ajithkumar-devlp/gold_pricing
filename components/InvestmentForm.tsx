'use client'

import { useState } from 'react'
import { usePortfolio } from '@/contexts/PortfolioContext'

interface InvestmentFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function InvestmentForm({ onClose, onSuccess }: InvestmentFormProps) {
  const { addNewInvestment, currentGoldPrice, currentSilverPrice } = usePortfolio()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    platform: '',
    type: 'digital' as 'physical' | 'digital',
    metal: 'gold' as 'gold' | 'silver',
    amount: '',
    purchasePrice: currentGoldPrice.toString(),
    purchaseDate: new Date().toISOString().split('T')[0]
  })

  const platforms = {
    digital: {
      gold: [
        'Paytm Gold', 'PhonePe Gold', 'Google Pay Gold', 'Amazon Pay Gold',
        'MobiKwik Gold', 'MMTC-PAMP Gold', 'SafeGold', 'Jar App Gold'
      ],
      silver: [
        'Paytm Silver', 'PhonePe Silver', 'Google Pay Silver', 'Amazon Pay Silver',
        'MobiKwik Silver', 'MMTC-PAMP Silver', 'SafeGold Silver', 'Jar App Silver'
      ]
    },
    physical: {
      gold: [
        'Tanishq', 'Kalyan Jewellers', 'Malabar Gold', 'HDFC Bank Gold',
        'SBI Gold', 'Joyalukkas', 'PC Jeweller', 'Local Jeweller'
      ],
      silver: [
        'Tanishq Silver', 'Kalyan Silver', 'Malabar Silver', 'HDFC Bank Silver',
        'SBI Silver', 'Joyalukkas Silver', 'PC Jeweller Silver', 'Local Silver Dealer'
      ]
    }
  }

  const getCurrentPrice = () => {
    return formData.metal === 'gold' ? currentGoldPrice : currentSilverPrice
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      
      // Update purchase price when metal changes
      if (name === 'metal') {
        updated.purchasePrice = value === 'gold' ? currentGoldPrice.toString() : currentSilverPrice.toString()
        updated.platform = '' // Reset platform selection
      }
      
      return updated
    })
  }

  const calculateQuantity = () => {
    const amount = parseFloat(formData.amount) || 0
    const price = parseFloat(formData.purchasePrice) || getCurrentPrice()
    return amount / price
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const amount = parseFloat(formData.amount)
      const purchasePrice = parseFloat(formData.purchasePrice)
      
      if (amount <= 0 || purchasePrice <= 0) {
        throw new Error('Please enter valid amounts')
      }

      const quantity = amount / purchasePrice

      await addNewInvestment({
        platform: formData.platform,
        type: formData.type,
        metal: formData.metal,
        amount,
        quantity,
        // For backward compatibility
        goldQuantity: formData.metal === 'gold' ? quantity : 0,
        silverQuantity: formData.metal === 'silver' ? quantity : 0,
        purchasePrice,
        purchaseDate: formData.purchaseDate
      })

      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Failed to add investment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Investment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precious Metal
            </label>
            <select
              name="metal"
              value={formData.metal}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="gold">Gold 🥇</option>
              <option value="silver">Silver 🥈</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="digital">Digital {formData.metal === 'gold' ? 'Gold' : 'Silver'}</option>
              <option value="physical">Physical {formData.metal === 'gold' ? 'Gold' : 'Silver'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            >
              <option value="">Select Platform</option>
              {platforms[formData.type][formData.metal].map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="Enter amount invested"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Price per gram (₹)
            </label>
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              required
              min="1"
              step={formData.metal === 'silver' ? '0.01' : '1'}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="Price per gram when purchased"
            />
            <p className="text-xs text-gray-500 mt-1">
              Current {formData.metal} price: ₹{getCurrentPrice().toLocaleString()}/gram
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Date
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            />
          </div>

          {formData.amount && formData.purchasePrice && (
            <div className={`p-3 rounded-lg ${formData.metal === 'gold' ? 'bg-gold-50' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-600">
                {formData.metal === 'gold' ? 'Gold' : 'Silver'} Quantity: <span className="font-semibold">{calculateQuantity().toFixed(3)}g</span>
              </p>
              <p className="text-sm text-gray-600">
                Current Value: <span className="font-semibold">₹{Math.round(calculateQuantity() * getCurrentPrice()).toLocaleString()}</span>
              </p>
              <p className={`text-sm font-semibold ${
                (calculateQuantity() * getCurrentPrice()) > parseFloat(formData.amount) 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                P&L: ₹{Math.round((calculateQuantity() * getCurrentPrice()) - parseFloat(formData.amount)).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Investment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}