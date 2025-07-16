import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,
  
  // Used when no locale matches
  defaultLocale: defaultLocale,
  
  // Always show the locale in the URL
  localePrefix: 'always',
  
  // Redirect to default locale if no locale is specified
  localeDetection: true
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|ar)/:path*']
}; 