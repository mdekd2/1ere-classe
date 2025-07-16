'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, DollarSign, CheckCircle } from 'lucide-react'
import { Payment } from '@/lib/types'

interface PaymentFormProps {
  amount: number
  onPaymentComplete: (payment: Payment) => void
  onCancel: () => void
}

export default function PaymentForm({ amount, onPaymentComplete, onCancel }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile_money'>('cash')
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [mobileMoneyDetails, setMobileMoneyDetails] = useState({
    phone: '',
    provider: 'mobisud'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const payment: Payment = {
      id: Date.now().toString(),
      reservationId: 'temp-reservation-id',
      amount,
      method: paymentMethod,
      status: 'completed',
      transactionId: `TXN-${Date.now()}`,
      createdAt: new Date()
    }

    setIsProcessing(false)
    onPaymentComplete(payment)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Complete your booking payment
        </p>
        <div className="mt-4 text-3xl font-bold text-teal-600 dark:text-teal-400">
          {amount.toLocaleString()} MRU
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Payment Method
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                className="mr-3"
              />
              <DollarSign className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Cash Payment</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Pay at the station</div>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="paymentMethod"
                value="mobile_money"
                checked={paymentMethod === 'mobile_money'}
                onChange={(e) => setPaymentMethod(e.target.value as 'mobile_money')}
                className="mr-3"
              />
              <Smartphone className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Mobile Money</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">MobiSud, Chinguitel, Mattel</div>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                className="mr-3"
              />
              <CreditCard className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard</div>
              </div>
            </label>
          </div>
        </div>

        {/* Mobile Money Form */}
        {paymentMethod === 'mobile_money' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Money Provider
              </label>
              <select
                value={mobileMoneyDetails.provider}
                onChange={(e) => setMobileMoneyDetails({...mobileMoneyDetails, provider: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="mobisud">MobiSud</option>
                <option value="chinguitel">Chinguitel</option>
                <option value="mattel">Mattel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={mobileMoneyDetails.phone}
                onChange={(e) => setMobileMoneyDetails({...mobileMoneyDetails, phone: e.target.value})}
                placeholder="+222 123456789"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )}

        {/* Credit Card Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: formatCardNumber(e.target.value)})}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: formatExpiry(e.target.value)})}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )}

        {/* Cash Payment Info */}
        {paymentMethod === 'cash' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Cash Payment</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You can pay in cash when you arrive at the station. Please bring exact change.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              `Pay ${amount.toLocaleString()} MRU`
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 