'use client'

import Link from 'next/link'
import { 
  Bus, 
  MapPin, 
  ArrowLeft,
  FileText,
  Phone,
  Mail,
  Clock,
  MapPinIcon,
  Shield,
  Star,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Heart,
  Zap
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import TripSearch from '@/components/TripSearch'
import { useTranslations, useLocale } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')
  const tBooking = useTranslations('booking')
  const locale = useLocale()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-teal-600">
      <Navigation />
      {/* Hero Section */}
      <div className="relative z-10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 text-white leading-tight px-2">
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 md:mb-4 text-gray-200 px-4 sm:px-6">
              {t('hero.subtitle')}
            </p>
            <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 text-teal-200 font-medium px-4 sm:px-6">
              {t('destinations.nouakchott')} & {t('destinations.nouadhibou')}, Mauritanie
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-6">
              <Link href={`/${locale}/search`} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base md:text-lg transition-colors inline-block text-center min-h-[44px] flex items-center justify-center">
                {t('hero.cta')}
              </Link>
              <Link href={`/${locale}/bookings`} className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base md:text-lg transition-colors inline-block text-center min-h-[44px] flex items-center justify-center">
                {tBooking('title')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Search Section */}
      <div className="relative z-10 bg-white dark:bg-gray-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('hero.searchPlaceholder')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
              {t('searchSubtitle')}
            </p>
          </div>
          
          <TripSearch className="max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Locations Section */}
      <div className="relative z-10 bg-gray-50 dark:bg-gray-800 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('locations.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
              {t('locations.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Nouakchott Location */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <div className="flex items-center mb-3 sm:mb-4 lg:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {t('locations.nouakchott.title')}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-sm sm:text-base">
                    {t('destinations.nouakchott')}
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{tCommon('address')}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 break-words">
                      {t('locations.nouakchott.address')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{tCommon('phone')}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {t('locations.nouakchott.phone')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{tCommon('email')}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 break-all">
                      {t('locations.nouakchott.email')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{tCommon('hours')}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {t('locations.nouakchott.hours')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 lg:mt-6">
                <Link 
                  href={`/${locale}/search`}
                  className="inline-flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base min-h-[44px]"
                >
                  {tCommon('bookFrom')} {t('destinations.nouakchott')}
                </Link>
              </div>
            </div>

            {/* Nouadhibou Location */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {t('locations.nouadhibou.title')}
                  </h3>
                  <p className="text-teal-600 dark:text-teal-400 font-medium text-sm sm:text-base">
                    {t('destinations.nouadhibou')}
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{tCommon('address')}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 break-words">
                      {t('locations.nouadhibou.address')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{tCommon('phone')}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {t('locations.nouadhibou.phone')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{tCommon('email')}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 break-all">
                      {t('locations.nouadhibou.email')}
                    </p>
                  </div>
                </div>
          
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{tCommon('hours')}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {t('locations.nouadhibou.hours')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <Link 
                  href={`/${locale}/search`}
                  className="inline-flex items-center justify-center w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
                >
                  {tCommon('bookFrom')} {t('destinations.nouadhibou')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
