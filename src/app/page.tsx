import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n/config'

export default function RootPage() {
  // Always redirect to the default locale
  redirect(`/${defaultLocale}`)
} 