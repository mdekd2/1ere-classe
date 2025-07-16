export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Bus {
  id: string;
  name: string;
  capacity: number;
  layout: BusLayout;
  amenities: string[];
  isActive: boolean;
}

export interface BusLayout {
  rows: number;
  columns: number;
  seatMap: SeatStatus[][];
}

export type SeatStatus = 'available' | 'reserved' | 'selected';

export interface Route {
  id: string;
  from: string;
  to: string;
  distance: number;
  estimatedDuration: number;
  price: number;
  isActive: boolean;
}

export interface Trip {
  id: string;
  busId: string;
  routeId: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  availableSeats: number;
  status: 'scheduled' | 'departed' | 'arrived' | 'cancelled';
  bus?: Bus;
  route?: Route;
}

export interface Reservation {
  id: string;
  tripId: string;
  userId: string;
  seatNumber: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  totalPrice: number;
  createdAt: Date;
  trip?: Trip;
  user?: User;
}

export interface SearchFilters {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export interface SeatSelection {
  row: number;
  column: number;
  seatNumber: string;
}

// New types for enhanced functionality
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  relatedId?: string; // ID of related trip, reservation, etc.
}

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  method: 'cash' | 'card' | 'mobile_money';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
}

export interface TripStatus {
  id: string;
  tripId: string;
  status: 'on_time' | 'delayed' | 'departed' | 'arrived' | 'cancelled';
  message?: string;
  updatedAt: Date;
}

export interface Review {
  id: string;
  tripId: string;
  userId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Date;
  user?: User;
} 