'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CheckCircle, XCircle, Search, FileText } from 'lucide-react'
import Navigation from '@/components/Navigation'

interface VerificationResult {
  valid: boolean;
  error?: string;
  receipt?: {
    bookingId: string;
    tripDetails: {
      from: string;
      to: string;
    };
    passengerInfo: {
      name: string;
    };
    paymentInfo: {
      amount: number;
    };
  };
  verifiedAt?: string;
}

export default function VerifyReceiptPage() {
  const searchParams = useSearchParams()
  const t = useTranslations('receipt')
  const tCommon = useTranslations('common')
  
  const [signature, setSignature] = useState(searchParams.get('signature') || '')
  const [bookingId, setBookingId] = useState(searchParams.get('bookingId') || '')
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerification = async () => {
    if (!signature || !bookingId) {
      alert('Veuillez entrer la signature et l\'ID de réservation')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/verify-receipt?signature=${signature}&bookingId=${bookingId}`)
      const result = await response.json()
      setVerificationResult(result)
    } catch (error) {
      setVerificationResult({ valid: false, error: 'Erreur de connexion' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <FileText className="w-12 h-12 text-teal-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Vérifier l&apos;Authenticité du Reçu
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter the receipt&apos;s signature to verify its authenticity
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID de Réservation
              </label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: booking-123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Signature du Reçu
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: a1b2c3d4e5f6..."
              />
            </div>

            <button
              onClick={handleVerification}
              disabled={isLoading || !signature || !bookingId}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              {isLoading ? 'Vérification...' : 'Vérifier le Reçu'}
            </button>
          </div>

          {verificationResult && (
            <div className="mt-6">
              {verificationResult.valid ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                        Reçu Authentique
                      </h3>
                      <p className="text-green-700 dark:text-green-300">
                        Ce reçu a été vérifié et est authentique.
                      </p>
                    </div>
                  </div>
                  
                  {verificationResult.receipt && (
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Réservation:</span>
                        <span className="font-medium">{verificationResult.receipt.bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Trajet:</span>
                        <span className="font-medium">{verificationResult.receipt.tripDetails.from} → {verificationResult.receipt.tripDetails.to}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Passager:</span>
                        <span className="font-medium">{verificationResult.receipt.passengerInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Montant:</span>
                        <span className="font-medium">{verificationResult.receipt.paymentInfo.amount} MRU</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <XCircle className="w-6 h-6 text-red-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                        Reçu Invalide
                      </h3>
                      <p className="text-red-700 dark:text-red-300">
                        {verificationResult.error || 'Ce reçu n&apos;est pas authentique ou a été modifié.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                Vérifié le: {verificationResult.verifiedAt ? new Date(verificationResult.verifiedAt).toLocaleString('fr-FR') : 'Maintenant'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 