'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Bus, 
  Star,
  Wifi,
  Zap,
  Shield
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import SeatMap from '@/components/SeatMap'
import { mockTrips, mockReservations, getUpdatedBusLayout } from '@/lib/mock-data'
import { formatDate, formatTime, formatPrice, formatDuration, getStatusColor } from '@/lib/utils'
import { Trip, SeatSelection, BusLayout } from '@/lib/types'

export default function TripDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([])
  const [passengers, setPassengers] = useState(1)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [busLayout, setBusLayout] = useState<BusLayout | null>(null)

  useEffect(() => {
    const tripId = params.id as string
    try {
      const foundTrip = mockTrips.find(t => t.id === tripId)
      
      if (foundTrip) {
        setTrip(foundTrip)
        // Get updated layout with reserved seats
        const layout = getUpdatedBusLayout(foundTrip.busId, mockReservations)
        setBusLayout(layout)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to load trip')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const handleSeatSelect = (seat: SeatSelection) => {
    const isSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber)
    
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.seatNumber !== seat.seatNumber))
    } else {
      setSelectedSeats(prev => [...prev, seat])
    }
  }

  const handleContinue = () => {
    if (selectedSeats.length === 0) return
    
    const seatNumbers = selectedSeats.map(seat => seat.seatNumber).join(',')
    router.push(`/booking/${trip?.id}?seats=${seatNumbers}&passengers=${passengers}`)
  }

  if (!trip || !busLayout) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading trip details...</p>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = trip.price * selectedSeats.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Information */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Trip Details
              </h1>

              {/* Trip Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
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
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {trip.route?.from} → {trip.route?.to}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Departure: {formatTime(trip.departureTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Arrival: {formatTime(trip.arrivalTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <span>Duration: {formatDuration(trip.route?.estimatedDuration || 0)}</span>
                    <span>Distance: {trip.route?.distance} km</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{trip.availableSeats} seats available</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Bus Amenities
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {trip.bus?.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      {amenity === 'WiFi' && <Wifi className="w-4 h-4 text-blue-500" />}
                      {amenity === 'USB Charging' && <Zap className="w-4 h-4 text-yellow-500" />}
                      {amenity === 'Air Conditioning' && <Shield className="w-4 h-4 text-green-500" />}
                      {amenity === 'Reclining Seats' && <Users className="w-4 h-4 text-purple-500" />}
                      {amenity === 'Entertainment System' && <Star className="w-4 h-4 text-pink-500" />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passenger Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Number of Passengers
                </h3>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value={1}>1 Passenger</option>
                  <option value={2}>2 Passengers</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers</option>
                </select>
              </div>

              {/* Price Summary */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Price per seat:</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(trip.price)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Selected seats:</span>
                  <span className="text-gray-900 dark:text-white">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-green-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
                className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Booking ({selectedSeats.length} seats)
              </button>
            </div>
          </div>

          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Select Your Seats
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Choose up to {passengers} seat(s) for your journey. Click on available seats to select them.
              </p>
              
              <SeatMap
                layout={busLayout}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                maxSeats={passengers}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 