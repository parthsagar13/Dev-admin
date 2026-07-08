import { AlertTriangle, CheckCircle2, FileWarning, Receipt, ShieldCheck } from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { HeroSection } from '@/components/info/HeroSection';
import { SectionTitle } from '@/components/info/SectionTitle';
import { PolicyCard } from '@/components/info/PolicyCard';
import { FAQ } from '@/components/info/FAQ';
import { Seo } from '@/components/info/Seo';

const eligible = [
  {
    title: 'Duplicate payment',
    desc: 'If you were charged twice for the same order, we’ll verify and refund the duplicate charge.',
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    title: 'Technical error',
    desc: 'If a technical issue prevented checkout completion but your payment was captured, we will investigate and resolve.',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: 'Corrupted ZIP file',
    desc: 'If the ZIP file is corrupted and we cannot provide a working replacement within a reasonable time.',
    icon: <FileWarning className="h-5 w-5" />,
  },
  {
    title: 'Download not available',
    desc: 'If you cannot access the download after payment success and we are unable to restore access.',
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    title: 'Payment successful but not delivered',
    desc: 'If payment succeeded but no purchase record/access was granted due to a system error.',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
];

const notEligible = [
  'Change of mind after purchase',
  'Wrong purchase (choosing the wrong template)',
  'Downloaded products or accessed source after purchase',
  'Compatibility issues with third-party tools, hosting, or outdated environments',
  'Lack of technical knowledge to customize or deploy',
];

const faqs = [
  {
    q: 'What is the refund request window?',
    a: 'Please contact support within 7 days of the purchase date. Requests outside this window may be declined.',
  },
  {
    q: 'How do I request a refund?',
    a: 'Email support@codemarket.com with your invoice number, payment reference, account email, and the reason for the request. Include screenshots when relevant.',
  },
  {
    q: 'How long do refunds take?',
    a: 'After verification, refunds are initiated to the original payment method. Processing times depend on your bank/payment instrument and can take several business days.',
  },
];

export const RefundPolicyPage = () => (
  <div className="min-h-screen bg-white">
    <Seo
      title="Refund Policy | CodeMarket"
      description="Read CodeMarket’s digital product Refund Policy. Refunds are considered for duplicate payments, technical errors, corrupted ZIP files, download access issues, or non-delivery after payment success."
      canonicalPath="/refund-policy"
      ogTitle="CodeMarket Refund Policy"
      ogDescription="Digital downloads with limited refund eligibility—see accepted cases and timeline."
    />
    <MarketplaceNavbar showSearch={false} />

    <HeroSection
      eyebrow="Refund Policy"
      icon={<Receipt className="h-3.5 w-3.5" />}
      title={
        <>
          Digital products with <span className="text-blue-600">clear</span> refund rules.
        </>
      }
      description="All products on CodeMarket are digital downloads. Refunds are considered only for specific, verifiable issues listed below."
      primaryCta={{ label: 'Contact Support', to: '/contact' }}
      secondaryCta={{ label: 'Browse Templates', to: '/templates' }}
    />

    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <section>
          <SectionTitle
            eyebrow="Eligibility"
            title="Refunds are considered for"
            description="Refunds are handled case-by-case after verification. Contact support within 7 days of purchase."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {eligible.map((item) => (
              <PolicyCard key={item.title} title={item.title} icon={item.icon}>
                {item.desc}
              </PolicyCard>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Non-refundable"
            title="Refunds are not available for"
            description="Because templates are digital downloads, we cannot offer refunds for subjective or post-access reasons."
          />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-600">
            <ul className="list-disc space-y-2 pl-5">
              {notEligible.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="How to request"
            title="What to include in your request"
            description="This helps us verify quickly and resolve access issues without delays."
          />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
            <ul className="list-disc space-y-2 pl-5">
              <li>Invoice number (if available)</li>
              <li>Payment reference or Razorpay payment ID</li>
              <li>Your account email used for purchase</li>
              <li>Template name and the issue you faced</li>
              <li>Screenshots or error messages (recommended)</li>
            </ul>
            <p className="mt-4">
              Send details to{' '}
              <a className="font-medium text-blue-600 hover:underline" href="mailto:support@codemarket.com">
                support@codemarket.com
              </a>
              .
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 shadow-sm">
            <SectionTitle eyebrow="FAQ" title="Refund FAQs" />
            <div className="mt-6">
              <FAQ items={faqs} />
            </div>
          </div>
        </section>
      </div>
    </main>

    <MarketplaceFooter />
  </div>
);

