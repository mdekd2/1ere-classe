import { NextRequest, NextResponse } from 'next/server'
import { mockReservations, mockTrips } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would get the user from the JWT token
    // For now, we'll return mock data filtered for the current user
    const url = new URL(request.url)
    const userEmail = url.searchParams.get('userEmail')
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      )
    }

    // Filter reservations for the current user
    const userReservations = mockReservations.filter(r => 
      r.passengerEmail === userEmail
    )

    // Calculate stats
    const totalBookings = userReservations.length
    const totalRevenue = userReservations
      .filter(r => r.status === 'paid' || r.status === 'confirmed')
      .reduce((sum, r) => sum + r.totalPrice, 0)
    
    // Calculate average rating (mock data for now)
    const averageRating = 4.5

    // Get recent bookings (last 5)
    const recentBookings = userReservations
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    return NextResponse.json({
      recentBookings,
      stats: {
        totalBookings,
        totalRevenue,
        averageRating
      }
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 