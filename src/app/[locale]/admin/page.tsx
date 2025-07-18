'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  BarChart3,
  X
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import { mockBuses, mockRoutes, mockTrips, mockReservations, addBus, addRoute, addTrip } from '@/lib/mock-data'
import { formatDate, formatTime, formatPrice, formatDuration, getStatusColor } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'

type TabType = 'overview' | 'buses' | 'routes' | 'trips' | 'reservations'

interface TripFormData {
  busId: string
  routeId: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  status: 'scheduled' | 'departed' | 'arrived' | 'cancelled'
}

interface BusFormData {
  name: string
  capacity: number
  rows: number
  columns: number
  amenities: string[]
  isActive: boolean
}

interface RouteFormData {
  from: string
  to: string
  distance: number
  estimatedDuration: number
  price: number
  isActive: boolean
}

export default function AdminPage() {
  const { user } = useAuth()
  const locale = useLocale()
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [showTripForm, setShowTripForm] = useState(false)
  const [showBusForm, setShowBusForm] = useState(false)
  const [showRouteForm, setShowRouteForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // Force re-render when data changes
  
  const [tripFormData, setTripFormData] = useState<TripFormData>({
    busId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: '',
    price: 0,
    availableSeats: 0,
    status: 'scheduled'
  })

  const [busFormData, setBusFormData] = useState<BusFormData>({
    name: '',
    capacity: 0,
    rows: 0,
    columns: 0,
    amenities: [],
    isActive: true
  })

  const [routeFormData, setRouteFormData] = useState<RouteFormData>({
    from: '',
    to: '',
    distance: 0,
    estimatedDuration: 0,
    price: 0,
    isActive: true
  })

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('loginRequired')}</h2>
        </div>
      </div>
    )
  }
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">{t('accessDenied')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{t('noPermission')}</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: t('overview'), icon: BarChart3 },
    { id: 'buses', name: t('buses'), icon: Bus },
    { id: 'routes', name: t('routes'), icon: MapPin },
    { id: 'trips', name: t('trips'), icon: Calendar },
    { id: 'reservations', name: t('reservations'), icon: Users },
  ]

  const totalRevenue = mockReservations
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.totalPrice, 0)

  const totalBookings = mockReservations.length
  const activeTrips = mockTrips.filter(t => t.status === 'scheduled').length
  const totalBuses = mockBuses.length

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      addTrip({
        busId: tripFormData.busId,
        routeId: tripFormData.routeId,
        departureTime: new Date(tripFormData.departureTime),
        arrivalTime: new Date(tripFormData.arrivalTime),
        price: tripFormData.price,
        availableSeats: tripFormData.availableSeats,
        status: tripFormData.status
      })
      setShowTripForm(false)
      setTripFormData({
        busId: '',
        routeId: '',
        departureTime: '',
        arrivalTime: '',
        price: 0,
        availableSeats: 0,
        status: 'scheduled'
      })
      setRefreshKey(prev => prev + 1) // Force re-render
      alert(t('tripAdded'))
    } catch (error) {
      alert(t('errorAdding') + (error as Error).message)
    }
  }

  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      addBus({
        name: busFormData.name,
        capacity: busFormData.capacity,
        layout: {
          rows: busFormData.rows,
          columns: busFormData.columns,
          seatMap: Array(busFormData.rows).fill(null).map(() => Array(busFormData.columns).fill('available'))
        },
        amenities: busFormData.amenities,
        isActive: busFormData.isActive
      })
      setShowBusForm(false)
      setBusFormData({
        name: '',
        capacity: 0,
        rows: 0,
        columns: 0,
        amenities: [],
        isActive: true
      })
      setRefreshKey(prev => prev + 1) // Force re-render
      alert(t('busAdded'))
    } catch (error) {
      alert(t('errorAdding') + (error as Error).message)
    }
  }

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      addRoute({
        from: routeFormData.from,
        to: routeFormData.to,
        distance: routeFormData.distance,
        estimatedDuration: routeFormData.estimatedDuration,
        price: routeFormData.price,
        isActive: routeFormData.isActive
      })
      setShowRouteForm(false)
      setRouteFormData({
        from: '',
        to: '',
        distance: 0,
        estimatedDuration: 0,
        price: 0,
        isActive: true
      })
      setRefreshKey(prev => prev + 1) // Force re-render
      alert(t('routeAdded'))
    } catch (error) {
      alert(t('errorAdding') + (error as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" key={refreshKey}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('dashboardTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('dashboardSubtitle')}
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('totalRevenue')}</p>
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('totalBookings')}</p>
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('activeTrips')}</p>
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('totalBuses')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBuses}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('recentReservations')}
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
                    {t('upcomingTrips')}
                  </h3>
                  <div className="space-y-3">
                    {mockTrips.filter(t => t.status === 'scheduled').slice(0, 5).map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {trip.route?.from} → {trip.route?.to}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {trip.departureTime ? formatDate(trip.departureTime) : 'N/A'} at {trip.departureTime ? formatTime(trip.departureTime) : 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {trip.availableSeats} {t('seats')}
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
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('buses')}</h2>
                <button 
                  onClick={() => setShowBusForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('addBus')}</span>
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
                <button 
                  onClick={() => setShowRouteForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
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
                <button 
                  onClick={() => setShowTripForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
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
                          <div>Departure: {trip.departureTime ? formatDate(trip.departureTime) : 'N/A'} at {trip.departureTime ? formatTime(trip.departureTime) : 'N/A'}</div>
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
                          <div>Email: {reservation.passengerEmail}</div>
                          <div>Phone: {reservation.passengerPhone}</div>
                          <div>Seat: {reservation.seatNumber}</div>
                        </div>
                      </div>

                      <div className="lg:col-span-1">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Trip:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {reservation.trip?.route?.from} → {reservation.trip?.route?.to}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Date:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {reservation.trip?.departureTime ? formatDate(reservation.trip.departureTime) : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Total:</span>
                            <span className="font-medium text-green-600">{formatPrice(reservation.totalPrice)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-1 flex space-x-2">
                        <button className="btn-outline text-sm flex-1">
                          <Eye className="w-4 h-4" />
                        </button>
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
        </div>
      </div>

      {/* Trip Form Modal */}
      {showTripForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Trip</h2>
              <button onClick={() => setShowTripForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTrip} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bus</label>
                <select
                  value={tripFormData.busId}
                  onChange={(e) => setTripFormData({...tripFormData, busId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                  required
                >
                  <option value="">Select a bus</option>
                  {mockBuses.map(bus => (
                    <option key={bus.id} value={bus.id}>{bus.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Route</label>
                <select
                  value={tripFormData.routeId}
                  onChange={(e) => setTripFormData({...tripFormData, routeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                  required
                >
                  <option value="">Select a route</option>
                  {mockRoutes.map(route => (
                    <option key={route.id} value={route.id}>{route.from} → {route.to}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Time</label>
                  <input
                    type="datetime-local"
                    value={tripFormData.departureTime}
                    onChange={(e) => setTripFormData({...tripFormData, departureTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrival Time</label>
                  <input
                    type="datetime-local"
                    value={tripFormData.arrivalTime}
                    onChange={(e) => setTripFormData({...tripFormData, arrivalTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (MRU)</label>
                  <input
                    type="number"
                    value={tripFormData.price}
                    onChange={(e) => setTripFormData({...tripFormData, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available Seats</label>
                  <input
                    type="number"
                    value={tripFormData.availableSeats}
                    onChange={(e) => setTripFormData({...tripFormData, availableSeats: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Add Trip
                </button>
                <button
                  type="button"
                  onClick={() => setShowTripForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bus Form Modal */}
      {showBusForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Bus</h2>
              <button onClick={() => setShowBusForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddBus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bus Name</label>
                <input
                  type="text"
                  value={busFormData.name}
                  onChange={(e) => setBusFormData({...busFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="e.g., Bus 1"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={busFormData.capacity}
                    onChange={(e) => setBusFormData({...busFormData, capacity: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rows</label>
                  <input
                    type="number"
                    value={busFormData.rows}
                    onChange={(e) => setBusFormData({...busFormData, rows: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Columns</label>
                  <input
                    type="number"
                    value={busFormData.columns}
                    onChange={(e) => setBusFormData({...busFormData, columns: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Add Bus
                </button>
                <button
                  type="button"
                  onClick={() => setShowBusForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Route Form Modal */}
      {showRouteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Route</h2>
              <button onClick={() => setShowRouteForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoute} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
                  <input
                    type="text"
                    value={routeFormData.from}
                    onChange={(e) => setRouteFormData({...routeFormData, from: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="e.g., Nouakchott"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
                  <input
                    type="text"
                    value={routeFormData.to}
                    onChange={(e) => setRouteFormData({...routeFormData, to: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="e.g., Nouadhibou"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={routeFormData.distance}
                    onChange={(e) => setRouteFormData({...routeFormData, distance: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (hours)</label>
                  <input
                    type="number"
                    value={routeFormData.estimatedDuration}
                    onChange={(e) => setRouteFormData({...routeFormData, estimatedDuration: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (MRU)</label>
                  <input
                    type="number"
                    value={routeFormData.price}
                    onChange={(e) => setRouteFormData({...routeFormData, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Add Route
                </button>
                <button
                  type="button"
                  onClick={() => setShowRouteForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 