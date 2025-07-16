'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '@/i18n/provider';
import { AuthProvider } from '@/lib/auth-context';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, any>;
}

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <AuthProvider>
      <I18nProvider locale={locale} messages={messages}>
        {children}
      </I18nProvider>
    </AuthProvider>
  );
} 