'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { locales, localeNames, localeFlags, Locale } from '@/i18n/config'

interface LanguageSwitcherProps {
  currentLocale: Locale
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (locale: Locale) => {
    setIsOpen(false)
    
    // Remove current locale from pathname if it exists
    const pathWithoutLocale = pathname.replace(/^\/(fr|ar)/, '')
    
    // Construct new path with new locale
    // Always include the locale prefix
    const newPath = `/${locale}${pathWithoutLocale || ''}`
    
    console.log('Switching language:', { currentPath: pathname, newPath, locale })
    router.push(newPath)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {localeFlags[currentLocale]} {localeNames[currentLocale]}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLanguage(locale)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  locale === currentLocale 
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-lg">{localeFlags[locale]}</span>
                <span className="font-medium">{localeNames[locale]}</span>
                {locale === currentLocale && (
                  <div className="ml-auto w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 