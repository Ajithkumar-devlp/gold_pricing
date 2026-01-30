'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Navigation() {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gold-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img src="/assets/logo1.png" alt="AURUM Logo" className="h-8 w-8 mr-3" />
              <Link href="/">
                <h1 className="text-2xl font-bold bg-clip-text text-gold cursor-pointer">
                  AURUM
                </h1>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/compare" className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium">
              Compare
            </Link>
            <Link href="/analysis" className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium">
              Analysis
            </Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.displayName || user.email}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-semibold">{user.displayName || 'User'}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay to close user menu when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  )
}