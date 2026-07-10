'use client';

import { AlertTriangle, BadgeCheck, ShieldCheck, XCircle } from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { HeroSection } from '@/components/info/HeroSection';
import { SectionTitle } from '@/components/info/SectionTitle';
import { PolicyCard } from '@/components/info/PolicyCard';

export const CancellationPolicyPage = () => (
  <div className="min-h-screen bg-white">
    <MarketplaceNavbar showSearch={false} />

    <HeroSection
      eyebrow="Cancellation Policy"
      icon={<XCircle className="h-3.5 w-3.5" />}
      title={
        <>
          Simple cancellation rules for <span className="text-blue-600">digital</span> purchases.
        </>
      }
      description="Because Neokit products are instant digital downloads, cancellations are only possible before payment completion."
      primaryCta={{ label: 'Contact Support', to: '/contact' }}
      secondaryCta={{ label: 'Refund Policy', to: '/refund-policy' }}
    />

    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <section>
          <SectionTitle
            eyebrow="Before payment"
            title="You can cancel only before payment completion"
            description="If you decide not to proceed, simply close the payment window before completing the transaction."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PolicyCard title="Payment not completed" icon={<BadgeCheck className="h-5 w-5" />}>
              If the payment is not completed, no order will be marked as paid and no download access
              is granted. You can try again later from the template page.
            </PolicyCard>
            <PolicyCard title="Do not share payment links" icon={<ShieldCheck className="h-5 w-5" />}>
              Use checkout only on Neokit. Do not attempt to complete payments using unknown or
              shared links.
            </PolicyCard>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="After payment"
            title="No cancellations after payment success"
            description="Once payment is successful and download access is granted, orders cannot be cancelled."
          />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-600">
            <p className="font-semibold text-gray-900">Why?</p>
            <p className="mt-2">
              Digital products provide instant access. After access is granted, we cannot “take back”
              the delivered product in a verifiable way.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Duplicate payments"
            title="Duplicate payments are handled as refunds"
            description="If you are charged multiple times for the same purchase, we will verify and refund the duplicate amount."
          />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-gray-400" />
              Contact support within 7 days and include your invoice number and payment references so
              we can verify quickly.
            </p>
            <p className="mt-4">
              Email:{' '}
              <a className="font-medium text-blue-600 hover:underline" href="mailto:support@neokit.com">
                support@neokit.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>

    <MarketplaceFooter />
  </div>
);

