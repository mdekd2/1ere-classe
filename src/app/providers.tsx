'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { BookingProvider } from '@/lib/booking-context';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <BookingProvider>
        {children}
      </BookingProvider>
    </AuthProvider>
  );
} 