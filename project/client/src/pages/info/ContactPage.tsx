import { HelpCircle, Mail } from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { HeroSection } from '@/components/info/HeroSection';
import { SectionTitle } from '@/components/info/SectionTitle';
import { ContactForm } from '@/components/info/ContactForm';
import { ContactInfo } from '@/components/info/ContactInfo';
import { FAQ } from '@/components/info/FAQ';
import { Seo } from '@/components/info/Seo';

const faqs = [
  {
    q: 'How soon will I get a response?',
    a: 'We typically respond within 24–48 business hours (Monday to Saturday, 10:00 AM to 7:00 PM IST). For billing and access issues, include your invoice number if available.',
  },
  {
    q: 'I paid successfully but can’t download. What should I do?',
    a: 'Log in with the same email used during purchase and visit “My Downloads”. If access is still missing, contact support with your payment reference and template name.',
  },
  {
    q: 'Can you help with installation and customization?',
    a: 'Yes. We can guide you through setup, dependencies, and common customization paths. For advanced custom work, our team may share recommendations or paid assistance options.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'CodeMarket sells digital products. Refunds are considered for specific cases such as duplicate payments, technical errors, corrupted ZIP files, or product not delivered after successful payment. See the Refund Policy for details.',
  },
];

export const ContactPage = () => (
  <div className="min-h-screen bg-white">
    <Seo
      title="Contact CodeMarket | Support & Sales"
      description="Contact CodeMarket for support, licensing, billing, and sales inquiries. Get help with downloads, invoices, and template setup."
      canonicalPath="/contact"
      ogTitle="Contact CodeMarket"
      ogDescription="Support and sales contact details, response times, and FAQs."
    />
    <MarketplaceNavbar showSearch={false} />

    <HeroSection
      eyebrow="Contact"
      icon={<Mail className="h-3.5 w-3.5" />}
      title={
        <>
          Let’s get you <span className="text-blue-600">unstuck</span>.
        </>
      }
      description="Reach out for support, billing questions, licensing clarification, or sales inquiries. We’re here to help you ship faster."
      primaryCta={{ label: 'Browse Templates', to: '/templates' }}
      secondaryCta={{ label: 'Refund Policy', to: '/refund-policy' }}
    />

    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <ContactForm />
        <ContactInfo />
      </div>

      <section className="mt-16">
        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 shadow-sm">
          <SectionTitle
            eyebrow="Frequently asked questions"
            title="Quick answers before you write"
            description="If you’re contacting us about a purchase, include your invoice number and the template name for faster resolution."
          />
          <div className="mt-6">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-semibold text-gray-900">Expected response time</p>
            <p className="mt-1">
              We reply within <span className="font-medium text-gray-900">24–48 business hours</span>.
              For urgent access issues, include payment reference, template name, and your account email.
            </p>
          </div>
        </div>
      </section>
    </main>

    <MarketplaceFooter />
  </div>
);

