'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Bus, 
  CreditCard,
  User,
  Mail,
  Phone,
  CheckCircle
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import { mockTrips } from '@/lib/mock-data'
import { formatDate, formatTime, formatPrice, formatDuration } from '@/lib/utils'
import { Trip } from '@/lib/types'

interface PassengerInfo {
  name: string
  email: string
  phone: string
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [passengers, setPassengers] = useState(1)
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const tripId = params.id as string
    const foundTrip = mockTrips.find(t => t.id === tripId)
    
    if (foundTrip) {
      setTrip(foundTrip)
    }

    const seatsParam = searchParams.get('seats')
    const passengersParam = searchParams.get('passengers')
    
    if (seatsParam) {
      setSelectedSeats(seatsParam.split(','))
    }
    
    if (passengersParam) {
      const passengerCount = parseInt(passengersParam)
      setPassengers(passengerCount)
      setPassengerInfo(Array(passengerCount).fill({ name: '', email: '', phone: '' }))
    }
  }, [params.id, searchParams])

  const handlePassengerInfoChange = (index: number, field: keyof PassengerInfo, value: string) => {
    const updatedInfo = [...passengerInfo]
    updatedInfo[index] = { ...updatedInfo[index], [field]: value }
    setPassengerInfo(updatedInfo)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Redirect to confirmation page after 2 seconds
    setTimeout(() => {
      router.push('/bookings')
    }, 2000)
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading booking details...</p>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = trip.price * selectedSeats.length

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your reservation has been successfully created. You will receive a confirmation email shortly.
            </p>
            <div className="animate-pulse">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Seat Selection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Complete Your Booking
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Trip Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Trip Summary
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{trip.route?.from} → {trip.route?.to}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(trip.departureTime)} at {formatTime(trip.departureTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bus className="w-4 h-4" />
                      <span>{trip.bus?.name}</span>
                    </div>
                    <div>
                      <span>Selected Seats: {selectedSeats.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Passenger Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Passenger Information
                  </h3>
                  <div className="space-y-4">
                    {passengerInfo.map((passenger, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Passenger {index + 1} - Seat {selectedSeats[index]}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Full Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                required
                                value={passenger.name}
                                onChange={(e) => handlePassengerInfoChange(index, 'name', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter full name"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="email"
                                required
                                value={passenger.email}
                                onChange={(e) => handlePassengerInfoChange(index, 'email', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter email address"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Phone
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="tel"
                                required
                                value={passenger.phone}
                                onChange={(e) => handlePassengerInfoChange(index, 'phone', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter phone number"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Payment will be processed securely
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="123"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter cardholder name"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    `Pay ${formatPrice(totalPrice)}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Price Summary
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Price per seat:</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(trip.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Number of seats:</span>
                  <span className="text-gray-900 dark:text-white">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Service fee:</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(0)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-green-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  What&apos;s Included
                </h4>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                  <li>• Reserved seat(s)</li>
                  <li>• Free cancellation (24h before)</li>
                  <li>• Email confirmation</li>
                  <li>• Customer support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 