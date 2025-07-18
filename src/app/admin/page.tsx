'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bus, Users, MapPin, Clock, CreditCard, Settings, TrendingUp, DollarSign, Calendar, Plus, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/lib/auth-context'
import { useBookings } from '@/lib/booking-context'
import { formatDate, formatTime, formatPrice, formatDuration, getStatusColor } from '@/lib/utils'
import { mockTrips, mockBuses, mockReservations, mockRoutes } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

type TabType = 'overview' | 'buses' | 'routes' | 'trips' | 'reservations'

export default function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please log in as admin to access the dashboard.</h2>
        </div>
      </div>
    )
  }
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h2>
          <p className="text-gray-700 dark:text-gray-300">You do not have permission to view this page.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'buses', name: 'Buses', icon: Bus },
    { id: 'routes', name: 'Routes', icon: MapPin },
    { id: 'trips', name: 'Trips', icon: Clock },
    { id: 'reservations', name: 'Reservations', icon: Users },
  ]

  const totalRevenue = mockReservations
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.totalPrice, 0)

  const totalBookings = mockReservations.length
  const activeTrips = mockTrips.filter(t => t.status === 'scheduled').length
  const totalBuses = mockBuses.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your transportation business
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(totalRevenue)}</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBookings}</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Trips</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeTrips}</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Bus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Buses</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBuses}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Reservations
                  </h3>
                  <div className="space-y-3">
                    {mockReservations.slice(0, 5).map((reservation) => (
                      <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {reservation.passengerName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {reservation.trip?.route?.from} → {reservation.trip?.route?.to}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(reservation.totalPrice)}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {reservation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Upcoming Trips
                  </h3>
                  <div className="space-y-3">
                    {mockTrips.filter(t => t.status === 'scheduled').slice(0, 5).map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {trip.route?.from} → {trip.route?.to}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(trip.departureTime)} at {formatTime(trip.departureTime)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {trip.availableSeats} seats
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatPrice(trip.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'buses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Buses</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Bus</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBuses.map((bus) => (
                  <div key={bus.id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {bus.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bus.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bus.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <div>Capacity: {bus.capacity} seats</div>
                      <div>Layout: {bus.layout.rows} rows × {bus.layout.columns} columns</div>
                      <div>Amenities: {bus.amenities.slice(0, 2).join(', ')}...</div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="btn-outline text-sm flex-1 flex items-center justify-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button className="btn-outline text-sm flex-1 flex items-center justify-center space-x-1">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button className="btn-outline text-sm flex-1 flex items-center justify-center space-x-1 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Routes</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Route</span>
                </button>
              </div>

              <div className="space-y-4">
                {mockRoutes.map((route) => (
                  <div key={route.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {route.from}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">From</div>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {route.to}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">To</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {route.distance} km
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Distance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDuration(route.estimatedDuration)}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-green-600">
                            {formatPrice(route.price)}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Price</div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn-outline text-sm">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="btn-outline text-sm text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Trips</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Trip</span>
                </button>
              </div>

              <div className="space-y-4">
                {mockTrips.map((trip) => (
                  <div key={trip.id} className="card">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {trip.route?.from} → {trip.route?.to}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          <div>Bus: {trip.bus?.name}</div>
                          <div>Departure: {formatDate(trip.departureTime)} at {formatTime(trip.departureTime)}</div>
                          <div>Duration: {formatDuration(trip.route?.estimatedDuration || 0)}</div>
                        </div>
                      </div>

                      <div className="lg:col-span-1">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Price:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatPrice(trip.price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Available Seats:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{trip.availableSeats}</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-1 flex space-x-2">
                        <button className="btn-outline text-sm flex-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn-outline text-sm flex-1 text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reservations</h2>
                <div className="flex space-x-2">
                  <button className="btn-outline text-sm">
                    Export Data
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {mockReservations.map((reservation) => (
                  <div key={reservation.id} className="card">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {reservation.passengerName}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                            {reservation.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          <div>{reservation.trip?.route?.from} → {reservation.trip?.route?.to}</div>
                          <div>Seat: {reservation.seatNumber}</div>
                          <div>Booked: {formatDate(reservation.createdAt)}</div>
                        </div>
                      </div>

                      <div className="lg:col-span-1">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Total:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatPrice(reservation.totalPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Email:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{reservation.passengerEmail}</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-1 flex space-x-2">
                        <button className="btn-outline text-sm flex-1">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="btn-outline text-sm flex-1">
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button className="btn-outline text-sm flex-1 text-red-600 hover:text-red-700">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 