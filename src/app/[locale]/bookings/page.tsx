'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Bus, 
  Users,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import { useTranslations } from 'next-intl'
import { mockReservations } from '@/lib/mock-data'
import { formatDate, formatTime, formatPrice, formatDuration, getStatusColor } from '@/lib/utils'
import { Reservation } from '@/lib/types'

export default function BookingsPage() {
  const t = useTranslations('bookings')
  const tCommon = useTranslations('common')
  const tStatus = useTranslations('status')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>(mockReservations)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterReservations(term, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterReservations(searchTerm, status)
  }

  const filterReservations = (search: string, status: string) => {
    let filtered = mockReservations

    if (search) {
      filtered = filtered.filter(reservation =>
        reservation.trip?.route?.from.toLowerCase().includes(search.toLowerCase()) ||
        reservation.trip?.route?.to.toLowerCase().includes(search.toLowerCase()) ||
        reservation.passengerName.toLowerCase().includes(search.toLowerCase()) ||
        reservation.seatNumber.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === status)
    }

    setFilteredReservations(filtered)
  }

  const getStatusBadge = (status: string) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {tStatus(status as keyof typeof tStatus)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">{t('allStatus')}</option>
                  <option value="pending">{tStatus('pending')}</option>
                  <option value="confirmed">{tStatus('confirmed')}</option>
                  <option value="paid">{tStatus('paid')}</option>
                  <option value="cancelled">{tStatus('cancelled')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('noBookings')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? t('tryAdjusting')
                  : t('noBookingsYet')
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link href="/search" className="btn-primary">
                  {t('bookFirstTrip')}
                </Link>
              )}
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <div key={reservation.id} className="card hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Trip Information */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Bus className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {reservation.trip?.bus?.name}
                        </span>
                      </div>
                      {getStatusBadge(reservation.status)}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {reservation.trip?.route?.from} → {reservation.trip?.route?.to}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{reservation.trip?.departureTime ? formatDate(reservation.trip.departureTime) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{reservation.trip?.departureTime ? formatTime(reservation.trip.departureTime) : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>{t('duration')}: {formatDuration(reservation.trip?.route?.estimatedDuration || 0)}</span>
                        <span>{t('seat')}: {reservation.seatNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Passenger Information */}
                  <div className="lg:col-span-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {t('passengerDetails')}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        <span className="font-medium">{t('name')}:</span> {reservation.passengerName}
                      </div>
                      <div>
                        <span className="font-medium">{t('email')}:</span> {reservation.passengerEmail}
                      </div>
                      <div>
                        <span className="font-medium">{t('phone')}:</span> {reservation.passengerPhone}
                      </div>
                      <div>
                        <span className="font-medium">{t('booked')}:</span> {reservation.createdAt ? formatDate(reservation.createdAt) : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="lg:col-span-1 flex flex-col justify-between">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {formatPrice(reservation.totalPrice)}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>{t('viewDetails')}</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        <span>{t('downloadTicket')}</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <span>{t('cancelBooking')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredReservations.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredReservations.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t('totalBookings')}
              </div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredReservations.filter(r => r.status === 'paid').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t('paid')}
              </div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredReservations.filter(r => r.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t('confirmed')}
              </div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(filteredReservations.reduce((sum, r) => sum + r.totalPrice, 0))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t('totalSpent')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 