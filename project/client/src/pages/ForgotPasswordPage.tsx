import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Code2, Loader2 } from 'lucide-react';
import { authApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';

const schema = z.object({
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await authApi.forgotPassword(data.email);
      setSent(true);
      toast.success('Check your email for reset instructions');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-gray-100 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Code2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <p className="text-sm text-gray-500">We&apos;ll send you a reset link</p>
          </CardHeader>
          <CardContent>
            {sent ? (
              <p className="text-center text-sm text-gray-600">
                If an account exists with that email, a reset link has been sent. Check the server
                console in development (email provider not yet integrated).
              </p>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                </Button>
              </form>
            )}
            <p className="mt-6 text-center text-sm text-gray-500">
              <Link to="/login" className="text-blue-600 hover:underline">
                ← Back to login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <MarketplaceFooter />
    </div>
  );
};
