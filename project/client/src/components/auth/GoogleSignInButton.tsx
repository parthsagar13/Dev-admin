'use client';

import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isGoogleAuthEnabled } from '@/lib/googleAuth';
import { GoogleIcon } from './GoogleIcon';

interface GoogleSignInButtonProps {
  onSuccess: (code: string) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

const GoogleSignInButtonInner = ({ onSuccess, disabled, className }: GoogleSignInButtonProps) => {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'popup',
    onSuccess: async (response) => {
      try {
        setLoading(true);
        await onSuccess(response.code);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Google sign-in failed');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      const errorType = String(error?.error ?? '');
      if (errorType.includes('popup') || errorType.includes('access_denied') || errorType.includes('cancel')) {
        toast.error('Google sign-in was cancelled');
        return;
      }
      toast.error('Google sign-in failed. Please try again.');
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      className={className ?? 'h-11 w-full gap-3 rounded-lg border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}
      disabled={disabled || loading}
      onClick={() => login()}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <GoogleIcon />
          <span>Continue with Google</span>
        </>
      )}
    </Button>
  );
};

export const GoogleSignInButton = (props: GoogleSignInButtonProps) => {
  if (!isGoogleAuthEnabled) {
    return null;
  }

  return <GoogleSignInButtonInner {...props} />;
};
