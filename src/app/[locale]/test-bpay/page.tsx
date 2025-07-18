'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'
import BPayButton from '@/components/BPayButton'

export default function TestBPayPage() {
  const t = useTranslations('payment')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState(2500)
  const [message, setMessage] = useState('')

  const handleSuccess = () => {
    setMessage('Paiement initié avec succès !')
  }

  const handleError = (error: string) => {
    setMessage(`Erreur: ${error}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Test BPay
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+222123456789"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Montant (MRU)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('Erreur') 
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' 
                  : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              }`}>
                {message}
              </div>
            )}

            <BPayButton
              amount={amount}
              phone={phone}
              bookingId="test-booking-123"
              onSuccess={handleSuccess}
              onError={handleError}
              disabled={!phone}
            />
          </div>

          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Instructions de test
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Entrez un numéro de téléphone valide</li>
              <li>• Le montant sera envoyé à BPay</li>
              <li>• Vous serez redirigé vers l&apos;interface BPay</li>
              <li>• Vérifiez les logs pour les callbacks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 