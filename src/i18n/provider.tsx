'use client'

import { NextIntlClientProvider } from 'next-intl'
import { ReactNode } from 'react'
import { Locale } from './config'

interface I18nProviderProps {
  children: ReactNode
  locale: Locale
  messages: Record<string, any>
}

export function I18nProvider({ children, locale, messages }: I18nProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
} 