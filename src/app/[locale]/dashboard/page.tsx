'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useBookings } from '@/lib/booking-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Clock, 
  Star,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Plus
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import TripStatusTracker from '@/components/TripStatusTracker'
import ReviewsSection from '@/components/ReviewsSection'
import { mockTrips } from '@/lib/mock-data'
import { formatDate, formatTime, formatPrice } from '@/lib/utils'
import { Trip, Review } from '@/lib/types'
import { useLocale } from 'next-intl'

export default function DashboardPage() {
  const { user } = useAuth()
  const { userBookings, getUserStats } = useBookings()
  const router = useRouter()
  const locale = useLocale()
  const [activeTrips, setActiveTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleAddReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date(),
      user: user ? { ...user, name: user.firstName + ' ' + user.lastName } : undefined
    }
    setReviews(prev => [newReview, ...prev])
  }

  if (!user) {
    return null
  }

  // Get stats from booking context
  const stats = getUserStats()
  const recentBookings = userBookings.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here&apos;s what&apos;s happening with your trips and bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Bus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Trips</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeTrips.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Bookings
                </h2>
                <Link
                  href={`/${locale}/bookings`}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
                >
                  View All
                </Link>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Bus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No bookings yet</p>
                  <Link
                    href={`/${locale}/search`}
                    className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book Your First Trip</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {booking.passengerName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {booking.trip?.route?.from} → {booking.trip?.route?.to}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{booking.trip?.departureTime ? formatDate(booking.trip.departureTime) : 'N/A'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{booking.trip?.departureTime ? formatTime(booking.trip.departureTime) : 'N/A'}</span>
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6">
                <Link
                  href={`/${locale}/bookings`}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white rounded-lg transition-colors"
                >
                  <span>View All Bookings</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href={`/${locale}/search`}
                  className="flex items-center space-x-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span className="text-teal-700 dark:text-teal-300 font-medium">Book New Trip</span>
                </Link>
                <Link
                  href={`/${locale}/account`}
                  className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">My Account</span>
                </Link>
                <Link
                  href={`/${locale}/bookings`}
                  className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <Bus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300 font-medium">My Bookings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewsSection
            tripId="dashboard-reviews"
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        </div>
      </div>
    </div>
  )
} 