'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { updateProfile } from 'firebase/auth'
import { updateUserProfile } from '@/lib/firestore'

interface UserProfileProps {
  onClose: () => void
  onSuccess: () => void
}

export default function UserProfile({ onClose, onSuccess }: UserProfileProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [displayName, setDisplayName] = useState(user?.displayName || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (displayName.trim().length < 2) {
      setError('Name must be at least 2 characters long')
      setLoading(false)
      return
    }

    try {
      if (user) {
        // Update Firebase Auth profile
        await updateProfile(user, { displayName: displayName.trim() })
        
        // Update Firestore user profile
        await updateUserProfile(user.uid, {
          displayName: displayName.trim()
        })
        
        onSuccess()
        onClose()
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
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
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              minLength={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
            <p className="mt-1 text-xs text-gray-500">This name will be displayed throughout the app</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

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
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}