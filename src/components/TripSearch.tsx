'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Bus,
  Clock,
  ArrowRight
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { mockTrips, mockRoutes } from '@/lib/mock-data'
import { formatDate, formatTime, formatPrice, formatDuration, getStatusColor } from '@/lib/utils'
import { Trip, SearchFilters } from '@/lib/types'
import Link from 'next/link'

interface TripSearchProps {
  showResults?: boolean
  className?: string
}

export default function TripSearch({ showResults = true, className = '' }: TripSearchProps) {
  const t = useTranslations('search')
  const tCommon = useTranslations('common')
  const tTrip = useTranslations('trip')
  const locale = useLocale()
  
  const [filters, setFilters] = useState<SearchFilters>({
    from: '',
    to: '',
    date: '',
    passengers: 1
  })
  
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const cities = Array.from(new Set([
    ...mockRoutes.map(route => route.from),
    ...mockRoutes.map(route => route.to)
  ])).sort()

  useEffect(() => {
    if (hasSearched) {
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
    }
  }, [filters, hasSearched])

  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    setHasSearched(true)
  }

  const clearSearch = () => {
    setFilters({ from: '', to: '', date: '', passengers: 1 })
    setFilteredTrips([])
    setHasSearched(false)
  }

  return (
    <div className={className}>
      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filters.from}
              onChange={(e) => handleFilterChange('from', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">{t('from')}</option>
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">{t('to')}</option>
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filters.passengers}
              onChange={(e) => handleFilterChange('passengers', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value={1}>1 {t('passengers')}</option>
              <option value={2}>2 {t('passengers')}</option>
              <option value={3}>3 {t('passengers')}</option>
              <option value={4}>4 {t('passengers')}</option>
              <option value={5}>5+ {t('passengers')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSearch}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{t('search')}</span>
          </button>
          {(filters.from || filters.to || filters.date) && (
            <button
              onClick={clearSearch}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {showResults && hasSearched && (
        <div className="space-y-4">
          {filteredTrips.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('noResults')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('tryAdjusting')}
              </p>
              <button
                onClick={clearSearch}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {filteredTrips.length} {t('results')}
                </h3>
                <Link 
                  href={`/${locale}/search`}
                  className="text-teal-600 dark:text-teal-400 hover:underline text-sm"
                >
                  {t('viewAll')} <ArrowRight className="w-4 h-4 inline" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {filteredTrips.slice(0, 3).map((trip) => (
                  <div key={trip.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Trip Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Bus className="w-5 h-5 text-teal-600" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {trip.bus?.name}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white">
                              {trip.route?.from} → {trip.route?.to}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(trip.departureTime)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(trip.departureTime)}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                            <span>{tTrip('duration')}: {formatDuration(trip.route?.estimatedDuration || 0)}</span>
                            <span>{tTrip('availableSeats')}: {trip.availableSeats}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="lg:col-span-2 flex flex-col justify-between">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-teal-600 mb-2">
                            {formatPrice(trip.price)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {t('perPassenger')}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Link
                            href={`/${locale}/trip/${trip.id}`}
                            className="flex items-center justify-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <span>{tTrip('viewDetails')}</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/${locale}/booking/${trip.id}`}
                            className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <span>{tTrip('bookNow')}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
} 