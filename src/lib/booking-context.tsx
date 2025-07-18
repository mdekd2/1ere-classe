'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Reservation, Trip } from '@/lib/types'

interface BookingContextType {
  userBookings: Reservation[]
  addBooking: (booking: Omit<Reservation, 'id' | 'createdAt'>) => void
  updateBookingStatus: (bookingId: string, status: Reservation['status']) => void
  getUserStats: () => {
    totalBookings: number
    totalRevenue: number
    averageRating: number
  }
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [userBookings, setUserBookings] = useState<Reservation[]>([])

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('userBookings')
    if (savedBookings) {
      try {
        const bookings = JSON.parse(savedBookings)
        // Convert createdAt back to Date objects
        const parsedBookings = bookings.map((booking: Omit<Reservation, 'createdAt'> & { createdAt: string }) => ({
          ...booking,
          createdAt: new Date(booking.createdAt)
        }))
        setUserBookings(parsedBookings)
      } catch (error) {
        console.error('Error parsing saved bookings:', error)
        localStorage.removeItem('userBookings')
      }
    }
  }, [])

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userBookings', JSON.stringify(userBookings))
  }, [userBookings])

  const addBooking = (booking: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'pending' as const
    }
    
    setUserBookings((prev: Reservation[]) => [newBooking, ...prev])
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userBookings')
      const existing = stored ? JSON.parse(stored) : []
      localStorage.setItem('userBookings', JSON.stringify([newBooking, ...existing]))
    }
  }

  const updateBookingStatus = (bookingId: string, status: Reservation['status']) => {
    setUserBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status }
          : booking
      )
    )
  }

  const getUserStats = () => {
    const totalBookings = userBookings.length
    const totalRevenue = userBookings
      .filter(booking => booking.status === 'paid' || booking.status === 'confirmed')
      .reduce((sum, booking) => sum + booking.totalPrice, 0)
    const averageRating = 4.5 // Mock rating for now

    return {
      totalBookings,
      totalRevenue,
      averageRating
    }
  }

  return (
    <BookingContext.Provider value={{
      userBookings,
      addBooking,
      updateBookingStatus,
      getUserStats
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBookings must be used within BookingProvider')
  return ctx
} 