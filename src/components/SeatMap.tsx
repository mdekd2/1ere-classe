'use client'

import { useState } from 'react'
import { Bus, User, Check } from 'lucide-react'
import { cn, generateSeatNumber } from '@/lib/utils'
import { BusLayout, SeatStatus, SeatSelection } from '@/lib/types'

interface SeatMapProps {
  layout: BusLayout
  selectedSeats: SeatSelection[]
  onSeatSelect: (seat: SeatSelection) => void
  maxSeats?: number
}

export default function SeatMap({ layout, selectedSeats, onSeatSelect, maxSeats = 4 }: SeatMapProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)

  const handleSeatClick = (row: number, column: number, status: SeatStatus) => {
    if (status === 'reserved') return

    const seatNumber = generateSeatNumber(row, column)
    const isSelected = selectedSeats.some(seat => seat.seatNumber === seatNumber)

    if (isSelected) {
      // Deselect seat
      onSeatSelect({ row, column, seatNumber })
    } else if (selectedSeats.length < maxSeats) {
      // Select seat
      onSeatSelect({ row, column, seatNumber })
    }
  }

  const getSeatStatus = (row: number, column: number): SeatStatus => {
    const seatNumber = generateSeatNumber(row, column)
    const isSelected = selectedSeats.some(seat => seat.seatNumber === seatNumber)
    
    if (isSelected) return 'selected'
    return layout.seatMap[row][column]
  }

  const getSeatClasses = (row: number, column: number) => {
    const status = getSeatStatus(row, column)
    const seatNumber = generateSeatNumber(row, column)
    const isHovered = hoveredSeat === seatNumber

    return cn(
      'w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 relative',
      {
        'seat-available': status === 'available',
        'seat-selected': status === 'selected',
        'seat-reserved': status === 'reserved',
        'scale-110 shadow-lg': isHovered && status !== 'reserved',
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Bus Layout */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <Bus className="w-6 h-6 text-teal-600" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Toyota Hiace Interior
            </span>
          </div>
        </div>

        {/* Driver Area */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-300 dark:bg-gray-600 rounded-lg px-6 py-3 text-sm text-gray-700 dark:text-gray-200 font-medium">
            🚗 Driver & Front Passenger
          </div>
        </div>

        {/* Toyota Hiace Layout - Based on actual interior */}
        <div className="space-y-4">
          {/* Row 1 - 2 seats on each side */}
          <div className="flex justify-center space-x-4">
            {/* Left side - 2 seats */}
            <div className="flex space-x-2">
              {Array.from({ length: 2 }, (_, column) => {
                const seatNumber = generateSeatNumber(0, column)
                const status = getSeatStatus(0, column)
                
                return (
                  <button
                    key={`0-${column}`}
                    className={cn(
                      getSeatClasses(0, column),
                      'w-16 h-16' // Larger seats
                    )}
                    onClick={() => handleSeatClick(0, column, status)}
                    onMouseEnter={() => setHoveredSeat(seatNumber)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={status === 'reserved'}
                    title={`Seat ${seatNumber} - ${status}`}
                  >
                    {status === 'selected' && (
                      <Check className="w-6 h-6 text-white" />
                    )}
                    {status !== 'selected' && (
                      <span className={cn(
                        'text-sm font-medium',
                        status === 'reserved' ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
                      )}>
                        {seatNumber}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Aisle */}
            <div className="w-12 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <div className="w-2 h-10 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
            </div>

            {/* Right side - 2 seats */}
            <div className="flex space-x-2">
              {Array.from({ length: 2 }, (_, column) => {
                const actualColumn = column + 2
                const seatNumber = generateSeatNumber(0, actualColumn)
                const status = getSeatStatus(0, actualColumn)
                
                return (
                  <button
                    key={`0-${actualColumn}`}
                    className={cn(
                      getSeatClasses(0, actualColumn),
                      'w-16 h-16'
                    )}
                    onClick={() => handleSeatClick(0, actualColumn, status)}
                    onMouseEnter={() => setHoveredSeat(seatNumber)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={status === 'reserved'}
                    title={`Seat ${seatNumber} - ${status}`}
                  >
                    {status === 'selected' && (
                      <Check className="w-6 h-6 text-white" />
                    )}
                    {status !== 'selected' && (
                      <span className={cn(
                        'text-sm font-medium',
                        status === 'reserved' ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
                      )}>
                        {seatNumber}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Row 2 - 2 seats on each side */}
          <div className="flex justify-center space-x-4">
            {/* Left side - 2 seats */}
            <div className="flex space-x-2">
              {Array.from({ length: 2 }, (_, column) => {
                const seatNumber = generateSeatNumber(1, column)
                const status = getSeatStatus(1, column)
                
                return (
                  <button
                    key={`1-${column}`}
                    className={cn(
                      getSeatClasses(1, column),
                      'w-16 h-16'
                    )}
                    onClick={() => handleSeatClick(1, column, status)}
                    onMouseEnter={() => setHoveredSeat(seatNumber)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={status === 'reserved'}
                    title={`Seat ${seatNumber} - ${status}`}
                  >
                    {status === 'selected' && (
                      <Check className="w-6 h-6 text-white" />
                    )}
                    {status !== 'selected' && (
                      <span className={cn(
                        'text-sm font-medium',
                        status === 'reserved' ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
                      )}>
                        {seatNumber}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Aisle */}
            <div className="w-12 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <div className="w-2 h-10 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
            </div>

            {/* Right side - 2 seats */}
            <div className="flex space-x-2">
              {Array.from({ length: 2 }, (_, column) => {
                const actualColumn = column + 2
                const seatNumber = generateSeatNumber(1, actualColumn)
                const status = getSeatStatus(1, actualColumn)
                
                return (
                  <button
                    key={`1-${actualColumn}`}
                    className={cn(
                      getSeatClasses(1, actualColumn),
                      'w-16 h-16'
                    )}
                    onClick={() => handleSeatClick(1, actualColumn, status)}
                    onMouseEnter={() => setHoveredSeat(seatNumber)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={status === 'reserved'}
                    title={`Seat ${seatNumber} - ${status}`}
                  >
                    {status === 'selected' && (
                      <Check className="w-6 h-6 text-white" />
                    )}
                    {status !== 'selected' && (
                      <span className={cn(
                        'text-sm font-medium',
                        status === 'reserved' ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
                      )}>
                        {seatNumber}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Row 3 - 2 seats left, 3 seats right (bench) */}
          <div className="flex justify-center space-x-4">
            {/* Left side - 2 seats */}
            <div className="flex space-x-2">
              {Array.from({ length: 2 }, (_, column) => {
                const seatNumber = generateSeatNumber(2, column)
                const status = getSeatStatus(2, column)
                
                return (
                  <button
                    key={`2-${column}`}
                    className={cn(
                      getSeatClasses(2, column),
                      'w-16 h-16'
                    )}
                    onClick={() => handleSeatClick(2, column, status)}
                    onMouseEnter={() => setHoveredSeat(seatNumber)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={status === 'reserved'}
                    title={`Seat ${seatNumber} - ${status}`}
                  >
                    {status === 'selected' && (
                      <Check className="w-6 h-6 text-white" />
                    )}
                    {status !== 'selected' && (
                      <span className={cn(
                        'text-sm font-medium',
                        status === 'reserved' ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
                      )}>
                        {seatNumber}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Aisle */}
            <div className="w-12 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <div className="w-2 h-10 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
            </div>

            {/* Right side - 3 seats (bench) */}
            <div className="flex space-x-2">
              {Array.from({ length: 3 }, (_, column) => {
                const actualColumn = column + 2
                const seatNumber = generateSeatNumber(2, actualColumn)
                const status = getSeatStatus(2, actualColumn)
                
                return (
                  <button
                    key={`2-${actualColumn}`}
                    className={cn(
                      getSeatClasses(2, actualColumn),
                      'w-16 h-16'
                    )}
                    onClick={() => handleSeatClick(2, actualColumn, status)}
                    onMouseEnter={() => setHoveredSeat(seatNumber)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={status === 'reserved'}
                    title={`Seat ${seatNumber} - ${status}`}
                  >
                    {status === 'selected' && (
                      <Check className="w-6 h-6 text-white" />
                    )}
                    {status !== 'selected' && (
                      <span className={cn(
                        'text-sm font-medium',
                        status === 'reserved' ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
                      )}>
                        {seatNumber}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Additional rows if needed */}
          {layout.rows > 3 && Array.from({ length: layout.rows - 3 }, (_, rowIndex) => {
            const row = rowIndex + 3
            return (
              <div key={row} className="flex justify-center space-x-4">
                {/* Left side - 2 seats */}
                <div className="flex space-x-2">
                  {Array.from({ length: 2 }, (_, column) => {
                    const seatNumber = generateSeatNumber(row, column)
                    const status = getSeatStatus(row, column)
                    
                    return (
                      <button
                        key={`${row}-${column}`}
                        className={cn(
                          getSeatClasses(row, column),
                          'w-16 h-16'
                        )}
                        onClick={() => handleSeatClick(row, column, status)}
                        onMouseEnter={() => setHoveredSeat(seatNumber)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        disabled={status === 'reserved'}
                        title={`Seat ${seatNumber} - ${status}`}
                      >
                        {status === 'selected' && (
                          <Check className="w-6 h-6 text-white" />
                        )}
                        {status !== 'selected' && (
                          <span className={cn(
                            'text-sm font-medium',
                            status === 'reserved' ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
                          )}>
                            {seatNumber}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Aisle */}
                <div className="w-12 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-10 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
                </div>

                {/* Right side - 2 seats */}
                <div className="flex space-x-2">
                  {Array.from({ length: 2 }, (_, column) => {
                    const actualColumn = column + 2
                    const seatNumber = generateSeatNumber(row, actualColumn)
                    const status = getSeatStatus(row, actualColumn)
                    
                    return (
                      <button
                        key={`${row}-${actualColumn}`}
                        className={cn(
                          getSeatClasses(row, actualColumn),
                          'w-16 h-16'
                        )}
                        onClick={() => handleSeatClick(row, actualColumn, status)}
                        onMouseEnter={() => setHoveredSeat(seatNumber)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        disabled={status === 'reserved'}
                        title={`Seat ${seatNumber} - ${status}`}
                      >
                        {status === 'selected' && (
                          <Check className="w-6 h-6 text-white" />
                        )}
                        {status !== 'selected' && (
                          <span className={cn(
                            'text-sm font-medium',
                            status === 'reserved' ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
                          )}>
                            {seatNumber}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Back of bus */}
        <div className="flex justify-center mt-4">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-6 py-2 text-sm text-gray-600 dark:text-gray-300">
            🚪 Exit Door
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Toyota Hiace Seat Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 seat-available rounded flex items-center justify-center">
              <span className="text-xs text-teal-800">1A</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Available</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 seat-selected rounded flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Selected</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 seat-reserved rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">2B</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Reserved</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
              <div className="w-1 h-3 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Aisle</span>
          </div>
        </div>
        
        {/* Layout Info */}
        <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
          <p className="text-sm text-teal-700 dark:text-teal-300">
            <strong>Layout:</strong> 2 seats on left • Aisle in center • 2 seats on right (Row 3: 3-seat bench)
          </p>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            Selected Seats ({selectedSeats.length}/{maxSeats})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <span
                key={seat.seatNumber}
                className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium"
              >
                {seat.seatNumber}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 