'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bus, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTranslations, useLocale } from 'next-intl'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()
  const t = useTranslations('auth.login')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      console.log('Login attempt with locale:', locale)
      await login(username, password)
      // Redirect to home page after successful login with locale preserved
      const redirectPath = `/${locale}`
      console.log('Redirecting to:', redirectPath)
      router.push(redirectPath)
    } catch (error) {
      console.error('Login failed:', error)
      setError(error instanceof Error ? error.message : tCommon('error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-teal-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-500 rounded-xl flex items-center justify-center">
              <Bus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">1ere Classe</h1>
          <p className="text-teal-200">{t('subtitle')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')} / {t('username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-gray-900 bg-white placeholder-gray-500"
                placeholder={t('email')}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors pr-12 text-gray-900 bg-white placeholder-gray-500"
                  placeholder={t('password')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? tCommon('loading') : t('title')}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('demoCredentials')}:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>{t('admin')}:</strong> admin / admin123</p>
              <p><strong>{t('user')}:</strong> user / user123</p>
            </div>
          </div>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {t('noAccount')}{' '}
              <Link 
                href={`/${locale}/register`}
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                {t('signUp')}
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link 
              href={`/${locale}`}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
            >
              ← {tCommon('back')} {tCommon('to')} {tCommon('home')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 