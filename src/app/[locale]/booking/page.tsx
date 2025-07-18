'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useBookings } from '@/lib/booking-context'
import { useTranslations, useLocale } from 'next-intl'
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import BPayButton from '@/components/BPayButton'
import { mockTrips } from '@/lib/mock-data'
import { formatDate, formatTime, formatPrice } from '@/lib/utils'
import { Trip } from '@/lib/types'

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addBooking } = useBookings()
  const locale = useLocale()
  const t = useTranslations('booking')
  const tCommon = useTranslations('common')
  const tPayment = useTranslations('payment')
  
  const tripId = searchParams.get('tripId')
  const seatsParam = searchParams.get('seats')
  const selectedSeats = seatsParam ? seatsParam.split(',') : []
  
  const [trip, setTrip] = useState<Trip | null>(null)
  const [passengerInfo, setPassengerInfo] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  const [paymentMethod, setPaymentMethod] = useState('bpay')
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!tripId) {
      router.push(`/${locale}/search`)
      return
    }

    const foundTrip = mockTrips.find(t => t.id === tripId)
    if (foundTrip) {
      setTrip(foundTrip)
    } else {
      router.push(`/${locale}/search`)
    }
  }, [tripId, router, locale])

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`)
    }
  }, [user, router, locale])

  const handleInputChange = (field: string, value: string) => {
    setPassengerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateTotal = () => {
    if (!trip) return 0
    return trip.price * selectedSeats.length
  }

  const handleBooking = async () => {
    if (!trip || selectedSeats.length === 0 || !user) return

    setIsProcessing(true)
    setMessage('')
    
    try {
      // Create booking data
      const bookingData = {
        tripId: tripId!,
        userId: user.id,
        seatNumber: selectedSeats.join(', '),
        passengerName: passengerInfo.name,
        passengerEmail: passengerInfo.email,
        passengerPhone: passengerInfo.phone,
        status: 'confirmed' as const,
        totalPrice: calculateTotal(),
        trip: trip
      }

      // Add booking to context
      addBooking(bookingData)
      
      const newBookingId = `booking-${Date.now()}`
      setBookingId(newBookingId)
      
      setTimeout(() => {
        setIsProcessing(false)
        setBookingComplete(true)
      }, 2000)
    } catch (error) {
      console.error('Booking error:', error)
      setMessage('Booking failed. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleBPaySuccess = () => {
    // Create booking when BPay payment is successful
    if (!trip || selectedSeats.length === 0 || !user) return

    const bookingData = {
      tripId: tripId!,
      userId: user.id,
      seatNumber: selectedSeats.join(', '),
      passengerName: passengerInfo.name,
      passengerEmail: passengerInfo.email,
      passengerPhone: passengerInfo.phone,
      status: 'paid' as const,
      totalPrice: calculateTotal(),
      trip: trip
    }

    addBooking(bookingData)
    setMessage(tPayment('success'))
  }

  const handleBPayError = (error: string) => {
    setMessage(error)
  }

  if (!trip || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {tCommon('loading')}
            </h1>
          </div>
        </div>
      </div>
    )
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('bookingConfirmed')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('bookingNumber')}: {bookingId}
            </p>
            <div className="space-y-4">
              <Link
                href={`/${locale}/dashboard`}
                className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg"
              >
                {tCommon('back')} {tCommon('home')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link 
            href={`/${locale}/trip/${tripId}`}
            className="flex items-center text-teal-600 hover:text-teal-700 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tCommon('back')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Booking Form */}
          <div className="space-y-4 sm:space-y-6">
            {/* Trip Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {t('title')}
              </h2>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{tCommon('to')}</span>
                  <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm text-right">
                    {trip.route?.from} → {trip.route?.to}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{tCommon('date')}</span>
                  <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                    {trip.departureTime ? formatDate(trip.departureTime) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{tCommon('time')}</span>
                  <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                    {trip.departureTime ? formatTime(trip.departureTime) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t('selectedSeats')}</span>
                  <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm text-right">
                    {selectedSeats.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {t('passengerInfo')}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    {tCommon('name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={passengerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    {tCommon('email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={passengerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    {tCommon('phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={passengerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {tPayment('title')}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{tPayment('amount')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
                
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {t('totalPrice')}
                    </span>
                    <span className="text-sm sm:text-lg font-bold text-teal-600">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-4 sm:mt-6">
                <h4 className="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-3">
                  {tPayment('method')}
                </h4>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bpay"
                      checked={paymentMethod === 'bpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{tPayment('payWithBPay')}</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{tPayment('cash')}</span>
                  </label>
                </div>
              </div>

              {/* Payment Button */}
              <div className="mt-4 sm:mt-6">
                {paymentMethod === 'bpay' ? (
                  <BPayButton
                    amount={calculateTotal()}
                    phone={passengerInfo.phone}
                    bookingId={bookingId || `booking-${Date.now()}`}
                    tripDetails={{
                      from: trip.route?.from || '',
                      to: trip.route?.to || '',
                      departureDate: trip.departureTime ? formatDate(trip.departureTime) : '', 
                      departureTime: trip.departureTime ? formatTime(trip.departureTime) : ''
                    }}
                    passengerInfo={{
                      name: passengerInfo.name,
                      email: passengerInfo.email
                    }}
                    selectedSeats={selectedSeats}
                    onSuccess={handleBPaySuccess}
                    onError={handleBPayError}
                    disabled={!passengerInfo.phone || isProcessing}
                  />
                ) : (
                  <button
                    onClick={handleBooking}
                    disabled={isProcessing || !passengerInfo.name || !passengerInfo.email || !passengerInfo.phone}
                    className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isProcessing ? tCommon('loading') : t('confirmBooking')}
                  </button>
                )}
              </div>
              {message && (
                <div className={`mt-4 p-3 rounded-lg text-center text-sm sm:text-base ${message.includes('succès') || message.includes('نجاح') ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 