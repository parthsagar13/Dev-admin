'use client';

import { AuthProvider } from '@/context/AuthContext';
import { UserAuthProvider } from '@/context/UserAuthContext';
import { GoogleAuthProvider } from '@/components/auth/GoogleAuthProvider';
import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <GoogleAuthProvider>
          {children}
          <Toaster position="top-right" />
        </GoogleAuthProvider>
      </UserAuthProvider>
    </AuthProvider>
  );
}
