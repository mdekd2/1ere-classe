'use client'

import { useState, useEffect } from 'react'
import { 
  Bus, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  XCircle 
} from 'lucide-react'
import { Trip, TripStatus } from '@/lib/types'
import { formatTime } from '@/lib/utils'

interface TripStatusTrackerProps {
  trip: Trip
}

export default function TripStatusTracker({ trip }: TripStatusTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState<TripStatus['status']>('on_time')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [estimatedArrival, setEstimatedArrival] = useState<Date>(() => {
    const arrivalTime = typeof trip.arrivalTime === 'string' ? new Date(trip.arrivalTime) : trip.arrivalTime
    return arrivalTime instanceof Date && !isNaN(arrivalTime.getTime()) ? arrivalTime : new Date()
  })
  const [currentLocation, setCurrentLocation] = useState<string>('')

  // Mock status updates - in real app, this would come from API/WebSocket
  useEffect(() => {
    const statuses: TripStatus['status'][] = ['on_time', 'delayed', 'departed', 'arrived']
    const messages = [
      'Trip is running on schedule',
      'Trip is delayed by 15 minutes due to traffic',
      'Bus has departed from the station',
      'Bus has arrived at destination'
    ]
    const locations = [
      'At Nouakchott Station',
      'En route to Nouadhibou',
      'Passing through Rosso',
      'Approaching Nouadhibou'
    ]

    // Simulate status changes
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * statuses.length)
      setCurrentStatus(statuses[randomIndex])
      setStatusMessage(messages[randomIndex])
      setCurrentLocation(locations[randomIndex])
      
      if (statuses[randomIndex] === 'delayed') {
        const arrivalTime = typeof trip.arrivalTime === 'string' ? new Date(trip.arrivalTime) : trip.arrivalTime
        if (arrivalTime instanceof Date && !isNaN(arrivalTime.getTime())) {
          const newArrival = new Date(arrivalTime.getTime() + 15 * 60 * 1000) // +15 minutes
          setEstimatedArrival(newArrival)
        }
      }
    }, 10000) // Update every 10 seconds for demo

    return () => clearInterval(interval)
  }, [trip.arrivalTime])

  const getStatusIcon = (status: TripStatus['status']) => {
    switch (status) {
      case 'on_time':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'delayed':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'departed':
        return <Play className="w-5 h-5 text-blue-500" />
      case 'arrived':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: TripStatus['status']) => {
    switch (status) {
      case 'on_time':
        return 'text-green-600 dark:text-green-400'
      case 'delayed':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'departed':
        return 'text-blue-600 dark:text-blue-400'
      case 'arrived':
        return 'text-green-600 dark:text-green-400'
      case 'cancelled':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusBgColor = (status: TripStatus['status']) => {
    switch (status) {
      case 'on_time':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'delayed':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'departed':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'arrived':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'cancelled':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  const calculateProgress = () => {
    const now = new Date()
    const totalDuration = trip.arrivalTime.getTime() - trip.departureTime.getTime()
    const elapsed = now.getTime() - trip.departureTime.getTime()
    
    if (elapsed <= 0) return 0
    if (elapsed >= totalDuration) return 100
    
    return Math.min(100, (elapsed / totalDuration) * 100)
  }

  const progress = calculateProgress()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bus className="w-6 h-6 text-teal-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trip Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {trip.route?.from} → {trip.route?.to}
            </p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusBgColor(currentStatus)}`}>
          {getStatusIcon(currentStatus)}
          <span className={`text-sm font-medium ${getStatusColor(currentStatus)}`}>
            {currentStatus.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className={`p-4 rounded-lg border ${getStatusBgColor(currentStatus)} mb-6`}>
          <div className="flex items-center space-x-2">
            {getStatusIcon(currentStatus)}
            <p className={`text-sm font-medium ${getStatusColor(currentStatus)}`}>
              {statusMessage}
            </p>
          </div>
        </div>
      )}

      {/* Current Location */}
      {currentLocation && (
        <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <MapPin className="w-5 h-5 text-teal-600" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Current Location</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{currentLocation}</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
          <span>Departure: {trip.departureTime ? formatTime(trip.departureTime) : 'N/A'}</span>
          <span>Arrival: {estimatedArrival ? formatTime(estimatedArrival) : 'N/A'}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-teal-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{trip.route?.from}</span>
          <span>{trip.route?.to}</span>
        </div>
      </div>

      {/* Trip Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Duration</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {trip.route?.estimatedDuration} hours
          </p>
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Distance</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {trip.route?.distance} km
          </p>
        </div>
      </div>

      {/* Bus Information */}
      <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-teal-800 dark:text-teal-200">
              Bus: {trip.bus?.name}
            </p>
            <p className="text-xs text-teal-600 dark:text-teal-300">
              Capacity: {trip.bus?.capacity} passengers
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-teal-800 dark:text-teal-200">
              Available Seats
            </p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {trip.availableSeats}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 