'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import UserProfile from './UserProfile'

export default function Navigation() {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
      setShowMobileMenu(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleProfileUpdate = () => {
    // Refresh the page to show updated name
    window.location.reload()
  }

  const closeMobileMenu = () => {
    setShowMobileMenu(false)
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gold-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <img src="/assets/logo1.png" alt="AURUM Logo" className="h-6 w-6 sm:h-8 sm:w-8 mr-2" />
            <Link href="/" onClick={closeMobileMenu}>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gold-600 cursor-pointer">
                AURUM
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/compare" className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Compare
            </Link>
            <Link href="/analysis" className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Analysis
            </Link>
            {user && (
              <Link href="/dashboard" className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Dashboard
              </Link>
            )}
            
            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gold-600 px-2 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <div className="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden xl:block text-sm">{user.displayName || 'User'}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-semibold">{user.displayName || 'User'}</p>
                      <p className="text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileEdit(true)
                        setShowUserMenu(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gold-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-gold-500 hover:bg-gold-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button and user avatar */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && (
              <div className="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-gold-600 p-2 rounded-md transition-colors touch-manipulation"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 bg-white absolute left-0 right-0 shadow-lg">
            <div className="px-3 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gold-600 hover:bg-gray-50 transition-colors touch-manipulation"
              >
                <span className="mr-3">🏠</span>
                Home
              </Link>
              <Link
                href="/compare"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gold-600 hover:bg-gray-50 transition-colors touch-manipulation"
              >
                <span className="mr-3">🔍</span>
                Compare
              </Link>
              <Link
                href="/analysis"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gold-600 hover:bg-gray-50 transition-colors touch-manipulation"
              >
                <span className="mr-3">📊</span>
                Analysis
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gold-600 hover:bg-gray-50 transition-colors touch-manipulation"
                >
                  <span className="mr-3">📈</span>
                  Dashboard
                </Link>
              )}
              
              {user ? (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="px-3 py-2 mb-2">
                    <p className="text-base font-medium text-gray-900">{user.displayName || 'User'}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileEdit(true)
                      setShowMobileMenu(false)
                    }}
                    className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gold-600 hover:bg-gray-50 transition-colors touch-manipulation"
                  >
                    <span className="mr-3">👤</span>
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gold-600 hover:bg-gray-50 transition-colors touch-manipulation"
                  >
                    <span className="mr-3">🚪</span>
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-gold-600 hover:bg-gray-50 transition-colors touch-manipulation"
                  >
                    <span className="mr-3">🔑</span>
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-3 rounded-md text-base font-medium bg-gold-500 text-white hover:bg-gold-600 transition-colors touch-manipulation"
                  >
                    <span className="mr-3">✨</span>
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay to close user menu when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <UserProfile
          onClose={() => setShowProfileEdit(false)}
          onSuccess={handleProfileUpdate}
        />
      )}
    </nav>
  )
}