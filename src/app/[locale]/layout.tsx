import { ReactNode } from 'react';
import { getMessages } from '@/i18n/server';
import { locales, defaultLocale, Locale } from '@/i18n/config';
import '../globals.css';
import Providers from './providers';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: '1ere Classe - Réservation de bus',
  description: 'Voyagez confortablement en Mauritanie avec 1ere Classe.',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const validLocale = locales.includes(locale) ? locale : defaultLocale;
  const messages = await getMessages(validLocale);

  return (
    <Providers locale={validLocale} messages={messages}>
      {children}
    </Providers>
  );
} 