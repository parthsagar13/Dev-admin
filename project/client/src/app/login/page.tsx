import { Suspense } from 'react';
import { LoginPage } from '@/views/LoginPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Neokit account to access purchases and downloads.',
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
