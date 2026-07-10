'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { templateApi, paymentApi } from '@/services/api';
import { useUserAuth } from '@/context/UserAuthContext';
import { loadRazorpayScript } from '@/lib/razorpay';
import { formatPrice } from '@/lib/format';
import { BRAND_NAME } from '@/lib/brand';
import { NeokitWordmark } from '@/components/brand/NeokitLogo';
import type { Template } from '@/types';

export const CheckoutPage = ({ slug }: { slug?: string }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useUserAuth();
  const [template, setTemplate] = useState<Template | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      router.push(`/login?redirect=/checkout/${slug || ''}`);
      return;
    }
    if (!slug) return;
    templateApi.getBySlug(slug).then(setTemplate).catch(() => setTemplate(null));
  }, [slug, isAuthenticated, router]);

  const handlePay = async () => {
    if (!template || !user) return;

    try {
      setProcessing(true);
      const orderData = await paymentApi.createOrder(template._id);

      if (orderData.free) {
        toast.success('Free template claimed!');
        router.push(`/success?slug=${template.slug}`);
        return;
      }

      if (!orderData.keyId || !orderData.orderId || !orderData.dbOrderId) {
        throw new Error('Failed to create payment order');
      }

      await loadRazorpayScript();

      const options = {
        key: orderData.keyId,
        amount: Math.round((orderData.amount || 0) * 100),
        currency: orderData.currency || 'INR',
        name: BRAND_NAME,
        description: template.title,
        order_id: orderData.orderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: '#111827' },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI',
                instruments: [{ method: 'upi' }],
              },
            },
            sequence: ['block.upi'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const result = await paymentApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              dbOrderId: orderData.dbOrderId!,
            });
            toast.success('Payment successful!');
            const resultSlug = (result as { template?: { slug: string } }).template?.slug || template.slug;
            router.push(`/success?slug=${resultSlug}`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Payment verification failed');
            router.push('/payment-failed');
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed');
        router.push('/payment-failed');
      });
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <NeokitWordmark className="h-10" />
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="h-4 w-4" />
            Secure Checkout
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <Link href={slug ? `/templates/${slug}` : '/templates'} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Template
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <Card>
            <CardHeader>
              <CardTitle>Payment via Razorpay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-600">
              <p>Click &quot;Pay Now&quot; to open the secure Razorpay checkout.</p>
              <p>Supports UPI, cards, netbanking, and wallets.</p>
              <p className="text-xs text-gray-400">
                Logged in as {user?.email}
              </p>
            </CardContent>
          </Card>

          <Card className="h-fit lg:sticky lg:top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {template && (
                <div className="flex gap-4 border-b border-gray-100 pb-4">
                  <Image
                    src={template.thumbnailUrl}
                    alt={template.title}
                    width={96}
                    height={64}
                    className="h-16 w-24 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">{template.title}</p>
                    <p className="text-sm text-gray-500">{template.framework} Template</p>
                  </div>
                </div>
              )}
              <div className="space-y-2 py-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{template ? formatPrice(template.price, template.isFree, template.currency || 'INR') : '—'}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>{template ? formatPrice(template.price, template.isFree, template.currency || 'INR') : '—'}</span>
                </div>
              </div>
              <Button
                className="mt-4 h-12 w-full bg-gray-900 hover:bg-gray-800"
                onClick={handlePay}
                disabled={!template || processing}
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Pay Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};
