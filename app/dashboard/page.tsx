'use client'

import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to your AURUM Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Hello {user?.displayName || user?.email}, manage your gold investments here
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Portfolio Value</h3>
                  <p className="text-2xl font-bold text-gold-600">₹0</p>
                  <p className="text-sm text-gray-500">Start investing to see your portfolio</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Returns</h3>
                  <p className="text-2xl font-bold text-green-600">₹0</p>
                  <p className="text-sm text-gray-500">0% gain</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Gold Holdings</h3>
                  <p className="text-2xl font-bold text-blue-600">0g</p>
                  <p className="text-sm text-gray-500">Physical + Digital</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/compare"
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition-colors"
              >
                <span className="text-3xl mb-2">🔍</span>
                <h3 className="font-semibold text-gray-900">Compare Prices</h3>
                <p className="text-sm text-gray-600 text-center">Find best gold rates</p>
              </Link>

              <Link
                href="/analysis"
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition-colors"
              >
                <span className="text-3xl mb-2">📊</span>
                <h3 className="font-semibold text-gray-900">Market Analysis</h3>
                <p className="text-sm text-gray-600 text-center">View trends & insights</p>
              </Link>

              <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition-colors cursor-pointer">
                <span className="text-3xl mb-2">💰</span>
                <h3 className="font-semibold text-gray-900">Investment Tracker</h3>
                <p className="text-sm text-gray-600 text-center">Track your investments</p>
              </div>

              <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 transition-colors cursor-pointer">
                <span className="text-3xl mb-2">🔔</span>
                <h3 className="font-semibold text-gray-900">Price Alerts</h3>
                <p className="text-sm text-gray-600 text-center">Set price notifications</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📈</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-600 mb-6">Start comparing gold prices and making investments to see your activity here.</p>
              <Link
                href="/compare"
                className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Investing
              </Link>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}