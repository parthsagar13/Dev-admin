'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '@/services/api';
import { useUserAuth } from '@/context/UserAuthContext';

export const useGoogleAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUserAuth();

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleGoogleSuccess = async (code: string) => {
    const response = await authApi.googleLogin({ code });
    if (!response.user) {
      throw new Error('Google sign-in failed');
    }
    login(response.token, response.user);
    toast.success('Welcome!');
    router.push(redirectTo);
  };

  return { handleGoogleSuccess, redirectTo };
};
