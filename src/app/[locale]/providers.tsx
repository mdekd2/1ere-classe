'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '@/i18n/provider';
import { AuthProvider } from '@/lib/auth-context';
import { BookingProvider } from '@/lib/booking-context';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <AuthProvider>
      <BookingProvider>
        <I18nProvider locale={locale as "fr" | "ar"} messages={messages}>
          {children}
        </I18nProvider>
      </BookingProvider>
    </AuthProvider>
  );
} 