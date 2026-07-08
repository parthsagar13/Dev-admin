import { Cookie, Database, Lock, ShieldCheck, Users } from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { HeroSection } from '@/components/info/HeroSection';
import { SectionTitle } from '@/components/info/SectionTitle';
import { PolicyCard } from '@/components/info/PolicyCard';
import { FAQ } from '@/components/info/FAQ';
import { Seo } from '@/components/info/Seo';

const faqs = [
  {
    q: 'Do you store my card or UPI PIN?',
    a: 'No. Payments are processed by Razorpay. We do not store card numbers, UPI PINs, or sensitive payment authentication data on CodeMarket servers.',
  },
  {
    q: 'How do secure downloads work?',
    a: 'Templates are stored in a private Supabase bucket. After purchase, our backend verifies your account and generates a time-limited signed download link.',
  },
  {
    q: 'Can I delete my account?',
    a: 'Yes. Contact support to request account deletion. We may retain limited transaction records where legally required (for example, tax or compliance obligations).',
  },
];

export const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-white">
    <Seo
      title="Privacy Policy | CodeMarket"
      description="Read CodeMarket’s Privacy Policy covering the information we collect, how we use it, third-party services (Razorpay, Supabase), security practices, retention, and your rights."
      canonicalPath="/privacy-policy"
      ogTitle="CodeMarket Privacy Policy"
      ogDescription="How CodeMarket collects, uses, and protects your data."
    />
    <MarketplaceNavbar showSearch={false} />

    <HeroSection
      eyebrow="Privacy Policy"
      icon={<ShieldCheck className="h-3.5 w-3.5" />}
      title={
        <>
          Privacy, built with <span className="text-blue-600">trust</span>.
        </>
      }
      description="This Privacy Policy explains what information CodeMarket collects, how it is used, and the choices you have when using our marketplace."
      primaryCta={{ label: 'Browse Templates', to: '/templates' }}
      secondaryCta={{ label: 'Contact', to: '/contact' }}
    />

    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">
          Effective date: {new Date().toLocaleDateString()} · CodeMarket is a premium digital template marketplace.
        </p>

        <section className="mt-10">
          <SectionTitle
            eyebrow="Information we collect"
            title="Data we collect to provide the service"
            description="We collect only what we need to create accounts, process payments, deliver downloads, and improve the marketplace experience."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PolicyCard title="Account information" icon={<Users className="h-5 w-5" />}>
              When you create an account, we collect your name and email address. We store a hashed
              password for authentication.
            </PolicyCard>
            <PolicyCard title="Authentication data" icon={<Lock className="h-5 w-5" />}>
              We use JWT-based authentication to keep you signed in. We may store session-related
              tokens in your browser to maintain your login state.
            </PolicyCard>
            <PolicyCard title="Usage analytics" icon={<Database className="h-5 w-5" />}>
              We may collect basic usage data (such as pages visited, error events, and performance
              signals) to improve reliability and user experience.
            </PolicyCard>
            <PolicyCard title="Cookies" icon={<Cookie className="h-5 w-5" />}>
              We may use cookies or local storage to remember preferences, maintain login state, and
              support security features. You can control cookies through your browser settings.
            </PolicyCard>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Payment information"
            title="Payments are processed securely"
            description="CodeMarket uses Razorpay to process payments. We receive confirmation identifiers and transaction status, not sensitive payment credentials."
          />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-600">
            <p className="font-semibold text-gray-900">What we may store</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Payment status and timestamps</li>
              <li>Razorpay order ID, payment ID, and signature for verification</li>
              <li>Invoice number and purchase record needed for downloads and support</li>
            </ul>
            <p className="mt-4 font-semibold text-gray-900">What we do not store</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Card number, CVV, UPI PIN, or bank login credentials</li>
              <li>Full payment instrument details</li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="How we use data"
            title="Purpose-driven data use"
            description="We use data to provide essential marketplace functionality and to maintain security."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PolicyCard title="User accounts & JWT authentication" icon={<Lock className="h-5 w-5" />}>
              We use your account information to authenticate you, secure downloads, and show your
              purchase and download history.
            </PolicyCard>
            <PolicyCard title="Razorpay payments" icon={<ShieldCheck className="h-5 w-5" />}>
              We process payments via Razorpay and verify signatures to confirm successful purchases
              and prevent fraud.
            </PolicyCard>
            <PolicyCard title="Supabase Storage" icon={<Database className="h-5 w-5" />}>
              Templates are stored in a private Supabase bucket. We generate time-limited signed
              URLs after verifying your purchase.
            </PolicyCard>
            <PolicyCard title="MongoDB database" icon={<Database className="h-5 w-5" />}>
              We store account, order, payment, and download permissions in MongoDB to maintain an
              accurate purchase history and enforce access control.
            </PolicyCard>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Google login"
            title="Google login support (architecture ready)"
            description="CodeMarket has architecture support for Google login. If enabled in the future, we will update this policy to reflect the specific data used from Google (such as your email and profile name)."
          />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
            <p>
              When enabled, Google login will be used only to authenticate your account and reduce
              password friction. You will be able to access purchases and downloads using the same
              email identity.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle eyebrow="Security" title="How we protect your data" />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-600">
            <ul className="list-disc space-y-2 pl-5">
              <li>Passwords are stored as secure hashes, never as plain text.</li>
              <li>JWT-protected APIs restrict access to purchases and downloads.</li>
              <li>Signed download URLs expire quickly to reduce sharing and misuse.</li>
              <li>Razorpay signature verification helps prevent payment tampering.</li>
              <li>We limit access to sensitive environment secrets in production deployments.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Third-party services"
            title="Services we rely on"
            description="We use trusted third-party services to run CodeMarket."
          />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-gray-900">Razorpay</span> for payment processing
                and webhooks.
              </li>
              <li>
                <span className="font-medium text-gray-900">Supabase Storage</span> for secure,
                private template ZIP storage and signed URLs.
              </li>
              <li>
                <span className="font-medium text-gray-900">MongoDB</span> for account and commerce
                data storage (users, orders, payments, downloads).
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Data retention"
            title="How long we keep data"
            description="We retain data as long as needed to provide access to purchases and to comply with legal obligations."
          />
          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-600">
            <p>
              We keep account and purchase records so you can re-download templates you’ve bought.
              When you request deletion, we may retain limited records required for compliance,
              auditing, or dispute resolution.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Children’s privacy"
            title="Our services are for adults and businesses"
            description="CodeMarket is not intended for children under 13. We do not knowingly collect personal information from children."
          />
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Changes"
            title="Updates to this policy"
            description="We may update this Privacy Policy to reflect product changes, legal requirements, or security improvements. Changes take effect when posted on this page."
          />
        </section>

        <section className="mt-12">
          <SectionTitle
            eyebrow="Contact"
            title="Questions about privacy?"
            description="Contact us at support@codemarket.com for privacy questions, data requests, or account deletion."
          />
          <div className="mt-4 text-sm">
            <a className="font-medium text-blue-600 hover:underline" href="mailto:support@codemarket.com">
              support@codemarket.com
            </a>
          </div>
        </section>

        <section className="mt-12">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <SectionTitle eyebrow="FAQ" title="Privacy FAQs" />
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

