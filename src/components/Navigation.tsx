'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bus, 
  Menu, 
  X,
  User,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import NotificationSystem from './NotificationSystem'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslations, useLocale } from 'next-intl'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const t = useTranslations('navigation')
  const locale = useLocale()
  
  // Extract locale from pathname or default to 'fr'
  const currentLocale = pathname.startsWith('/ar') ? 'ar' : 'fr'

  const navigation = [
    { name: t('dashboard'), href: `/${locale}/dashboard` },
    { name: t('bookings'), href: `/${locale}/bookings` },
    { name: t('search'), href: `/${locale}/search` },
  ]
  // Only show Admin if user is admin
  if (user?.role === 'admin') {
    navigation.push({ name: t('admin'), href: `/${locale}/admin` })
  }

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">
                1ere Classe
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-white hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href ? "text-teal-400 bg-teal-900/20" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons and Auth */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user && <NotificationSystem userId={user.id} />}
            <LanguageSwitcher currentLocale={currentLocale} />
            <div className="hidden sm:flex items-center space-x-2">
              <button className="border border-white text-white hover:bg-white hover:text-gray-900 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                Our Pricing
              </button>
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                Seat Here
              </button>
            </div>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{user.firstName}</span>
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href={`/${locale}/account`}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>{t('account')}</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsUserMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link 
                  href={`/${locale}/login`}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  {t('login')}
                </Link>
                <Link 
                  href={`/${locale}/register`}
                  className="border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  {t('register')}
                </Link>
              </div>
            )}
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-white hover:text-teal-400 transition-colors rounded-lg hover:bg-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700">
            <div className="space-y-1 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-3 rounded-md text-base font-medium text-white hover:text-teal-400 hover:bg-teal-900/20 transition-colors ${
                    pathname === item.href ? "text-teal-400 bg-teal-900/20" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-700 mt-4">
                <button className="w-full border border-white text-white hover:bg-white hover:text-gray-900 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                  Our Pricing
                </button>
                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
                  Seat Here
                </button>
                {user ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2 bg-gray-700 rounded-lg">
                      <p className="text-white text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-gray-300 text-xs">{user.email}</p>
                    </div>
                    <Link
                      href={`/${locale}/account`}
                      className="block w-full text-left px-3 py-3 text-white hover:bg-teal-900/20 text-sm font-medium transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <button 
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors" 
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      href={`/${locale}/login`}
                      className="block w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href={`/${locale}/register`}
                      className="block w-full border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 