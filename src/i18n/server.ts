import { defaultLocale, Locale } from './config'

export async function getMessages(locale: Locale) {
  try {
    const messages = await import(`./locales/${locale}.json`)
    return messages.default
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error)
    // Fallback to default locale
    const defaultMessages = await import(`./locales/${defaultLocale}.json`)
    return defaultMessages.default
  }
} 