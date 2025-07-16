import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  if (!date) {
    return 'N/A'
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'N/A'
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

export function formatTime(date: Date | string): string {
  if (!date) {
    return 'N/A'
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'N/A'
  }
  
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function generateSeatNumber(row: number, column: number): string {
  return `${row + 1}${String.fromCharCode(65 + column)}`
}

export function parseSeatNumber(seatNumber: string): { row: number; column: number } {
  const row = parseInt(seatNumber.slice(0, -1)) - 1
  const column = seatNumber.charCodeAt(seatNumber.length - 1) - 65
  return { row, column }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MRU',
  }).format(price)
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'scheduled':
      return 'text-blue-600 bg-blue-100'
    case 'departed':
      return 'text-yellow-600 bg-yellow-100'
    case 'arrived':
      return 'text-green-600 bg-green-100'
    case 'cancelled':
      return 'text-red-600 bg-red-100'
    case 'pending':
      return 'text-orange-600 bg-orange-100'
    case 'confirmed':
      return 'text-blue-600 bg-blue-100'
    case 'paid':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
} 