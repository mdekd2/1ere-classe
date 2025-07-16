import { ReactNode } from 'react';
import { getMessages } from '@/i18n/server';
import { locales, defaultLocale, rtlLocales, Locale } from '@/i18n/config';
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
  params: { locale: Locale };
}) {
  const locale = locales.includes(params.locale) ? params.locale : defaultLocale;
  const messages = await getMessages(locale);

  return (
    <Providers locale={locale} messages={messages}>
      {children}
    </Providers>
  );
} 