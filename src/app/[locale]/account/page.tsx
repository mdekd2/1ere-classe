'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { 
  Bus, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Save, 
  X,
  MapPin,
  CreditCard
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/lib/auth-context'
import { mockReservations } from '@/lib/mock-data'
import { formatDate, formatPrice } from '@/lib/utils'

export default function AccountPage() {
  const { user } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  // Redirect if not logged in
  if (!user) {
    router.push(`/${locale}/login`)
    return null
  }

  // Get user's reservations
  const userReservations = mockReservations.filter(r => 
    r.passengerName === `${user.firstName} ${user.lastName}` ||
    r.passengerEmail === user.email
  )

  const handleSave = () => {
    // In a real app, you would update the user data here
    setIsEditing(false)
    // For now, just update the local state
    // You could add an updateUser function to the auth context
  }

  const handleCancel = () => {
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Account
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Manage your profile and view your bookings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.firstName}
                        onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{user.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.lastName}
                        onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                      />
                    ) : (
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white">{user.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white break-all">{user.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white">{user.phone}</p>
                  )}
                </div>

                {/* Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Username
                    </label>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white">{user.username}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Member Since
                    </label>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white">
                      {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Quick Stats
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Bookings</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {userReservations.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Active Bookings</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {userReservations.filter(r => r.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Spent</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {formatPrice(userReservations.reduce((sum, r) => sum + r.totalPrice, 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <Link
                  href={`/${locale}/search`}
                  className="flex items-center space-x-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400" />
                  <span className="text-teal-700 dark:text-teal-300 font-medium text-sm sm:text-base">Book New Trip</span>
                </Link>
                <Link
                  href={`/${locale}/bookings`}
                  className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300 font-medium text-sm sm:text-base">View Bookings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        {userReservations.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Recent Bookings
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {/* Mobile view - cards */}
              <div className="md:hidden space-y-4 p-4">
                {userReservations.slice(0, 5).map((reservation) => (
                  <div key={reservation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {reservation.trip?.route?.from} → {reservation.trip?.route?.to}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">
                          Seat {reservation.seatNumber}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300">
                      <span>{reservation.trip?.departureTime ? formatDate(reservation.trip.departureTime) : 'N/A'}</span>
                      <span className="font-medium">{formatPrice(reservation.totalPrice)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop view - table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Trip
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {userReservations.slice(0, 5).map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {reservation.trip?.route?.from} → {reservation.trip?.route?.to}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">
                              Seat {reservation.seatNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {reservation.trip?.departureTime ? formatDate(reservation.trip.departureTime) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatPrice(reservation.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 