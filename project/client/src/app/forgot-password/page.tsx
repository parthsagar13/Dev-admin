import { ForgotPasswordPage } from '@/views/ForgotPasswordPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Neokit account password.',
};

export default function Page() {
  return <ForgotPasswordPage />;
}
