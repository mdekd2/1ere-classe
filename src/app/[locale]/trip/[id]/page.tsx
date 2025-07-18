'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Bus, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Wifi, 
  Zap, 
  Snowflake,
  ArrowLeft,
  CreditCard
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import SeatMap from '@/components/SeatMap'
import { useTranslations } from 'next-intl'
import { mockTrips, mockBuses, parseSeatNumber } from '@/lib/mock-data'
import { formatDate, formatTime, formatPrice } from '@/lib/utils'
import { Trip, Bus as BusType } from '@/lib/types'

export default function TripDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.id as string
  const locale = params.locale as string
  const t = useTranslations('trip')
  const tCommon = useTranslations('common')
  const tBooking = useTranslations('booking')
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [trip, setTrip] = useState<Trip | null>(null)
  const [bus, setBus] = useState<BusType | null>(null)

  useEffect(() => {
    const foundTrip = mockTrips.find(t => t.id === tripId)
    if (foundTrip) {
      setTrip(foundTrip)
      const foundBus = mockBuses.find(b => b.id === foundTrip.busId)
      setBus(foundBus || null)
    }
  }, [tripId])

  if (!trip || !bus) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {tCommon('error')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('details')} {tCommon('notFound')}
            </p>
            <Link 
              href="/search" 
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg"
            >
              {tCommon('back')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSeatSelection = (seatSelection: { row: number; column: number; seatNumber: string }) => {
    setSelectedSeats(prev => 
      prev.includes(seatSelection.seatNumber) 
        ? prev.filter(s => s !== seatSelection.seatNumber)
        : [...prev, seatSelection.seatNumber]
    )
  }

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      router.push(`/${locale}/booking?tripId=${tripId}&seats=${selectedSeats.join(',')}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/search" 
            className="flex items-center text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tCommon('back')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bus className="w-6 h-6 text-teal-500 mr-2" />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {bus.name}
                  </h1>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-gray-600 dark:text-gray-300">4.8</span>
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-teal-500 mr-2" />
                <span className="text-lg text-gray-900 dark:text-white">
                  {trip.route?.from} → {trip.route?.to}
                </span>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-teal-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('departure')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {trip.departureTime ? formatTime(trip.departureTime) : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-teal-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{t('arrival')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {trip.arrivalTime ? formatTime(trip.arrivalTime) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('duration')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{trip.route?.estimatedDuration}h</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('distance')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{trip.route?.distance} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('availableSeats')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{trip.availableSeats}</p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t('amenities')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <Snowflake className="w-4 h-4 text-teal-500 mr-1" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">AC</span>
                  </div>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <Wifi className="w-4 h-4 text-teal-500 mr-1" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">WiFi</span>
                  </div>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <Zap className="w-4 h-4 text-teal-500 mr-1" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">USB Charging</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {tBooking('seatSelection')}
              </h2>
              <SeatMap 
                layout={bus.layout}
                selectedSeats={selectedSeats.map(seatNumber => {
                  const { row, column } = parseSeatNumber(seatNumber)
                  return { row, column, seatNumber }
                })}
                onSeatSelect={handleSeatSelection}
              />
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {tBooking('title')}
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{t('price')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(trip.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{tBooking('selectedSeats')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedSeats.length}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tBooking('totalPrice')}
                    </span>
                    <span className="text-lg font-bold text-teal-600">
                      {formatPrice(trip.price * selectedSeats.length)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
                className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {selectedSeats.length > 0 ? t('continue') : tBooking('selectSeats')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 