'use client'

import { useState } from 'react'
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BPayButtonProps {
  amount: number
  phone: string
  bookingId: string
  tripDetails?: {
    from: string
    to: string
    departureDate: string
    departureTime: string
  }
  passengerInfo?: {
    name: string
    email: string
  }
  selectedSeats?: string[]
  onSuccess?: () => void
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
}

export default function BPayButton({
  amount,
  phone,
  bookingId,
  tripDetails,
  passengerInfo,
  selectedSeats = [],
  onSuccess,
  onError,
  disabled = false,
  className = ''
}: BPayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const t = useTranslations('payment')

  const handlePayment = async () => {
    if (!phone) {
      onError?.('Numéro de téléphone requis')
      return
    }

    setIsLoading(true)
    setStatus('loading')

    try {
      const response = await fetch('/api/pay-with-bpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          phone,
          bookingId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de paiement')
      }

      setStatus('success')
      onSuccess?.()

      // Generate and download receipt
      await generateReceipt(data.paymentId)

    } catch (error) {
      console.error('Erreur BPay:', error)
      setStatus('error')
      onError?.(error instanceof Error ? error.message : 'Erreur de paiement')
    } finally {
      setIsLoading(false)
    }
  }

  const generateReceipt = async (paymentId: string) => {
    try {
      // Use actual data from props
      const receiptData = {
        bookingId,
        tripDetails: tripDetails || {
          from: 'Nouakchott',
          to: 'Nouadhibou',
          departureDate: new Date().toLocaleDateString('fr-FR'),
          departureTime: '08:00'
        },
        passengerInfo: {
          name: passengerInfo?.name || 'Passager',
          email: passengerInfo?.email || 'passager@example.com',
          phone: phone
        },
        paymentInfo: {
          paymentId,
          amount: amount,
          method: 'BPay'
        },
        selectedSeats: selectedSeats
      }

      const response = await fetch('/api/generate-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du reçu')
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${bookingId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

    } catch (error) {
      console.error('Erreur génération reçu:', error)
      // Don't throw error here as payment was successful
    }
  }

  const getButtonContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {t('processing')}
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            {t('success')}
          </>
        )
      case 'error':
        return (
          <>
            <XCircle className="w-5 h-5 mr-2 text-red-500" />
            {t('error')}
          </>
        )
      default:
        return (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            {t('payWithBPay')}
          </>
        )
    }
  }

  const getButtonClasses = () => {
    const baseClasses = 'w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center'
    
    switch (status) {
      case 'loading':
        return `${baseClasses} bg-blue-500 text-white cursor-not-allowed`
      case 'success':
        return `${baseClasses} bg-green-500 text-white cursor-not-allowed`
      case 'error':
        return `${baseClasses} bg-red-500 text-white hover:bg-red-600`
      default:
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading || status === 'loading'}
      className={getButtonClasses()}
    >
      {getButtonContent()}
    </button>
  )
} 