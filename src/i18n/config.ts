export const locales = ['fr', 'ar'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'fr'

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  ar: 'العربية'
}

export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  ar: '🇸🇦'
}

export const rtlLocales: Locale[] = ['ar'] 