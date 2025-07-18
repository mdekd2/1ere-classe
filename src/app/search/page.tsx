'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Filter,
  Bus,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import { mockTrips, mockRoutes } from '@/lib/mock-data'
import { formatDate, formatTime, formatPrice, formatDuration, getStatusColor } from '@/lib/utils'
import { Trip, SearchFilters } from '@/lib/types'

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    from: '',
    to: '',
    date: '',
    passengers: 1
  })
  
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>(mockTrips)
  const [showFilters, setShowFilters] = useState(false)

  const cities = Array.from(new Set([
    ...mockRoutes.map(route => route.from),
    ...mockRoutes.map(route => route.to)
  ])).sort()

  useEffect(() => {
    let filtered = mockTrips

    if (filters.from) {
      filtered = filtered.filter(trip => 
        trip.route?.from.toLowerCase().includes(filters.from.toLowerCase())
      )
    }

    if (filters.to) {
      filtered = filtered.filter(trip => 
        trip.route?.to.toLowerCase().includes(filters.to.toLowerCase())
      )
    }

    if (filters.date) {
      const filterDate = new Date(filters.date)
      filtered = filtered.filter(trip => {
        const tripDate = new Date(trip.departureTime)
        return tripDate.toDateString() === filterDate.toDateString()
      })
    }

    setFilteredTrips(filtered)
  }, [filters])

  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search Trips
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find and book your perfect journey
          </p>
        </div>

        {/* Search Filters */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Search Filters
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filters.from}
                onChange={(e) => handleFilterChange('from', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">From (Any)</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filters.to}
                onChange={(e) => handleFilterChange('to', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">To (Any)</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filters.passengers}
                onChange={(e) => handleFilterChange('passengers', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={1}>1 Passenger</option>
                <option value={2}>2 Passengers</option>
                <option value={3}>3 Passengers</option>
                <option value={4}>4 Passengers</option>
                <option value={5}>5+ Passengers</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {filteredTrips.length} trips found
            </p>
            <button
              onClick={() => setFilters({ from: '', to: '', date: '', passengers: 1 })}
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {filteredTrips.length === 0 ? (
            <div className="card text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No trips found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Try adjusting your search filters or check back later for new trips.
              </p>
              <button
                onClick={() => setFilters({ from: '', to: '', date: '', passengers: 1 })}
                className="btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <div key={trip.id} className="card hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Trip Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Bus className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {trip.bus?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">4.8</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {trip.route?.from} → {trip.route?.to}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Departure: {formatTime(trip.departureTime)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Arrival: {formatTime(trip.arrivalTime)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                        <span>Duration: {formatDuration(trip.route?.estimatedDuration || 0)}</span>
                        <span>Distance: {trip.route?.distance} km</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{trip.availableSeats} seats available</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="lg:col-span-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Amenities
                    </h4>
                    <div className="space-y-1">
                      {trip.bus?.amenities.slice(0, 3).map((amenity, index) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                          • {amenity}
                        </div>
                      ))}
                      {trip.bus?.amenities.length && trip.bus.amenities.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{trip.bus.amenities.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="lg:col-span-1 flex flex-col justify-between">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatPrice(trip.price)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        per passenger
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Link 
                        href={`/trip/${trip.id}`}
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                      >
                        <span>Select Seats</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button className="w-full btn-outline text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 