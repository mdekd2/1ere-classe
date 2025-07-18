import { Bus, Route, Trip, User, Reservation } from './types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'user',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@transport.com',
    phone: '+1234567891',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
]

export const mockBuses: Bus[] = [
  {
    id: '1',
    name: 'Toyota Hiace 1',
    capacity: 14,
    layout: {
      rows: 4,
      columns: 5,
      seatMap: Array(4).fill(null).map(() => Array(5).fill('available')),
    },
    amenities: ['AC', 'WiFi', 'USB Charging', 'Reclining Seats'],
    isActive: true,
  },
  {
    id: '2',
    name: 'Toyota Hiace 2',
    capacity: 14,
    layout: {
      rows: 4,
      columns: 5,
      seatMap: Array(4).fill(null).map(() => Array(5).fill('available')),
    },
    amenities: ['AC', 'WiFi', 'USB Charging'],
    isActive: true,
  },
  {
    id: '3',
    name: 'Toyota Hiace 3',
    capacity: 14,
    layout: {
      rows: 4,
      columns: 5,
      seatMap: Array(4).fill(null).map(() => Array(5).fill('available')),
    },
    amenities: ['AC', 'WiFi', 'USB Charging', 'Reclining Seats'],
    isActive: true,
  }
]

export const mockRoutes: Route[] = [
  {
    id: '1',
    from: 'Nouakchott',
    to: 'Nouadhibou',
    distance: 470,
    estimatedDuration: 6,
    price: 2500,
    isActive: true,
  },
  {
    id: '2',
    from: 'Nouadhibou',
    to: 'Nouakchott',
    distance: 470,
    estimatedDuration: 6,
    price: 2500,
    isActive: true,
  },
  {
    id: '3',
    from: 'Nouakchott',
    to: 'Rosso',
    distance: 200,
    estimatedDuration: 3,
    price: 1200,
    isActive: true,
  }
]

// Helper function to create today's date with specific time
function createTodayWithTime(hours: number, minutes: number = 0): Date {
  const today = new Date()
  today.setHours(hours, minutes, 0, 0)
  return today
}

// Helper function to create tomorrow's date with specific time
function createTomorrowWithTime(hours: number, minutes: number = 0): Date {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(hours, minutes, 0, 0)
  return tomorrow
}

export const mockTrips: Trip[] = [
  // Morning trips from Nouakchott to Nouadhibou
  {
    id: '1',
    busId: '1',
    routeId: '1',
    departureTime: createTodayWithTime(7, 0), // 7:00 AM
    arrivalTime: createTodayWithTime(13, 0), // 1:00 PM (6 hours later)
    price: 2500,
    availableSeats: 14,
    status: 'scheduled',
    bus: mockBuses[0],
    route: mockRoutes[0],
  },
  {
    id: '2',
    busId: '2',
    routeId: '1',
    departureTime: createTodayWithTime(7, 30), // 7:30 AM
    arrivalTime: createTodayWithTime(13, 30), // 1:30 PM (6 hours later)
    price: 2500,
    availableSeats: 14,
    status: 'scheduled',
    bus: mockBuses[1],
    route: mockRoutes[0],
  },
  {
    id: '3',
    busId: '3',
    routeId: '1',
    departureTime: createTodayWithTime(8, 0), // 8:00 AM
    arrivalTime: createTodayWithTime(14, 0), // 2:00 PM (6 hours later)
    price: 2500,
    availableSeats: 14,
    status: 'scheduled',
    bus: mockBuses[2],
    route: mockRoutes[0],
  },
  // Morning trips from Nouadhibou to Nouakchott
  {
    id: '4',
    busId: '1',
    routeId: '2',
    departureTime: createTodayWithTime(7, 0), // 7:00 AM
    arrivalTime: createTodayWithTime(13, 0), // 1:00 PM (6 hours later)
    price: 2500,
    availableSeats: 14,
    status: 'scheduled',
    bus: mockBuses[0],
    route: mockRoutes[1],
  },
  {
    id: '5',
    busId: '2',
    routeId: '2',
    departureTime: createTodayWithTime(7, 30), // 7:30 AM
    arrivalTime: createTodayWithTime(13, 30), // 1:30 PM (6 hours later)
    price: 2500,
    availableSeats: 14,
    status: 'scheduled',
    bus: mockBuses[1],
    route: mockRoutes[1],
  },
  {
    id: '6',
    busId: '3',
    routeId: '2',
    departureTime: createTodayWithTime(8, 0), // 8:00 AM
    arrivalTime: createTodayWithTime(14, 0), // 2:00 PM (6 hours later)
    price: 2500,
    availableSeats: 14,
    status: 'scheduled',
    bus: mockBuses[2],
    route: mockRoutes[1],
  },
  // Tomorrow's trips
  {
    id: '7',
    busId: '1',
    routeId: '1',
    departureTime: createTomorrowWithTime(7, 0), // 7:00 AM tomorrow
    arrivalTime: createTomorrowWithTime(13, 0), // 1:00 PM tomorrow
    price: 2500,
    availableSeats: 14,
    status: 'scheduled',
    bus: mockBuses[0],
    route: mockRoutes[0],
  },
  {
    id: '8',
    busId: '2',
    routeId: '1',
    departureTime: createTomorrowWithTime(7, 30), // 7:30 AM tomorrow
    arrivalTime: createTomorrowWithTime(13, 30), // 1:30 PM tomorrow
    price: 2500,
    availableSeats: 14,
    status: 'scheduled',
    bus: mockBuses[1],
    route: mockRoutes[0],
  },
  {
    id: '9',
    busId: '3',
    routeId: '1',
    departureTime: createTomorrowWithTime(8, 0), // 8:00 AM tomorrow
    arrivalTime: createTomorrowWithTime(14, 0), // 2:00 PM tomorrow
    price: 2500,
    availableSeats: 14,
    status: 'scheduled',
    bus: mockBuses[2],
    route: mockRoutes[0],
  },
  // Additional route example
  {
    id: '10',
    busId: '1',
    routeId: '3',
    departureTime: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
    arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 7), // 7 hours from now
    price: 1200,
    availableSeats: 14,
    status: 'scheduled',
    bus: mockBuses[0],
    route: mockRoutes[2],
  }
]

export const mockReservations: Reservation[] = []

// Functions to add new data
export function addBus(busData: Omit<Bus, 'id'>): Bus {
  const newBus: Bus = {
    ...busData,
    id: Date.now().toString(),
    layout: {
      rows: busData.layout.rows,
      columns: busData.layout.columns,
      seatMap: Array(busData.layout.rows).fill(null).map(() => Array(busData.layout.columns).fill('available')),
    }
  }
  mockBuses.push(newBus)
  return newBus
}

export function addRoute(routeData: Omit<Route, 'id'>): Route {
  const newRoute: Route = {
    ...routeData,
    id: Date.now().toString(),
  }
  mockRoutes.push(newRoute)
  return newRoute
}

export function addTrip(tripData: Omit<Trip, 'id' | 'bus' | 'route'>): Trip {
  const bus = mockBuses.find(b => b.id === tripData.busId)
  const route = mockRoutes.find(r => r.id === tripData.routeId)
  
  if (!bus || !route) {
    throw new Error('Bus or route not found')
  }

  const newTrip: Trip = {
    ...tripData,
    id: Date.now().toString(),
    bus,
    route,
  }
  mockTrips.push(newTrip)
  return newTrip
}

// Update seat maps with reserved seats
export function getUpdatedBusLayout(busId: string, reservations: Reservation[]): Bus['layout'] {
  const bus = mockBuses.find(b => b.id === busId)
  if (!bus) return { rows: 0, columns: 0, seatMap: [] }

  const layout = JSON.parse(JSON.stringify(bus.layout))
  
  reservations.forEach(reservation => {
    const { row, column } = parseSeatNumber(reservation.seatNumber)
    if (row >= 0 && row < layout.rows && column >= 0 && column < layout.columns) {
      layout.seatMap[row][column] = 'reserved'
    }
  })

  return layout
}

export function parseSeatNumber(seatNumber: string): { row: number; column: number } {
  const row = parseInt(seatNumber.slice(0, -1)) - 1
  const column = seatNumber.charCodeAt(seatNumber.length - 1) - 65
  return { row, column }
} 