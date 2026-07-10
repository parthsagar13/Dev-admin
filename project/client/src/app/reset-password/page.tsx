import { Suspense } from 'react';
import { ResetPasswordPage } from '@/views/ResetPasswordPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your Neokit account.',
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
}
