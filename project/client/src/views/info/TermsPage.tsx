'use client';

import { AlertTriangle, BadgeCheck, Download, FileLock2, Gavel, HelpCircle, ShieldCheck } from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { HeroSection } from '@/components/info/HeroSection';
import { SectionTitle } from '@/components/info/SectionTitle';
import { PolicyCard } from '@/components/info/PolicyCard';

export const TermsPage = () => (
  <div className="min-h-screen bg-white">
    <MarketplaceNavbar showSearch={false} />

    <HeroSection
      eyebrow="Terms & Conditions"
      icon={<Gavel className="h-3.5 w-3.5" />}
      title={
        <>
          Clear terms for a <span className="text-blue-600">premium</span> marketplace.
        </>
      }
      description="These Terms govern your access to Neokit and your purchase and use of digital templates. By using the website, you agree to these Terms."
      primaryCta={{ label: 'Browse Templates', to: '/templates' }}
      secondaryCta={{ label: 'Privacy Policy', to: '/privacy-policy' }}
    />

    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-500">
          Effective date: {new Date().toLocaleDateString()} · For questions, contact{' '}
          <a className="text-blue-600 hover:underline" href="mailto:support@neokit.com">
            support@neokit.com
          </a>
          .
        </p>

        <section className="mt-10 space-y-8">
          <div>
            <SectionTitle eyebrow="1. Acceptance of terms" title="By using Neokit, you agree" />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              By accessing or using Neokit, creating an account, or purchasing any product, you
              agree to be bound by these Terms. If you do not agree, do not use the website.
            </p>
          </div>

          <div>
            <SectionTitle
              eyebrow="2. Digital product sales"
              title="All products are digital downloads"
              description="Neokit sells digital templates and starter kits delivered electronically."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <PolicyCard title="Instant access" icon={<Download className="h-5 w-5" />}>
                After successful payment, download access is granted to your account. You can access
                purchased items from “My Downloads”.
              </PolicyCard>
              <PolicyCard title="No physical delivery" icon={<FileLock2 className="h-5 w-5" />}>
                Neokit does not ship physical goods. Delivery is performed via secure signed
                download links.
              </PolicyCard>
            </div>
          </div>

          <div>
            <SectionTitle
              eyebrow="3. Template licensing"
              title="License options"
              description="Templates are protected by copyright and are licensed, not sold."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <PolicyCard title="Personal license" icon={<BadgeCheck className="h-5 w-5" />}>
                Intended for personal projects and learning. You may use templates to build a single
                end product for yourself (subject to restrictions below).
              </PolicyCard>
              <PolicyCard title="Commercial license" icon={<ShieldCheck className="h-5 w-5" />}>
                Intended for commercial and client work. You may use templates in client projects
                and commercial products, subject to restrictions below.
              </PolicyCard>
            </div>
            <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Important:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>You may modify templates to fit your project.</li>
                <li>You may not redistribute, resell, repackage, or sublicense the template source.</li>
                <li>You may not claim the templates as your own original work.</li>
              </ul>
            </div>
          </div>

          <div>
            <SectionTitle
              eyebrow="4. Intellectual property"
              title="Copyright protection"
              description="All templates, preview assets, and brand content are protected by applicable laws."
            />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Neokit and its sellers retain all rights, title, and interest in and to the
              templates, including all associated intellectual property. Your purchase grants a
              limited, non-exclusive, non-transferable license under the applicable license terms.
            </p>
          </div>

          <div>
            <SectionTitle
              eyebrow="5. Download policy"
              title="Secure downloads & access control"
              description="Access is tied to your account. Do not share download links."
            />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Downloads are served via time-limited signed URLs. Sharing or reselling access,
              distributing ZIP files publicly, or attempting to bypass access control may result in
              suspension or termination.
            </p>
          </div>

          <div>
            <SectionTitle
              eyebrow="6. Account responsibilities"
              title="Keep your account secure"
              description="You are responsible for activity under your account."
            />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              You agree to provide accurate account information and to maintain the confidentiality
              of your login credentials. If you suspect unauthorized access, contact support
              immediately.
            </p>
          </div>

          <div>
            <SectionTitle eyebrow="7. Payment terms" title="Payments and verification" />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Payments are processed via Razorpay. We verify payment signatures to confirm purchase
              completion. Orders may remain pending if a payment is interrupted or fails.
            </p>
          </div>

          <div>
            <SectionTitle eyebrow="8. Refund terms" title="Refunds are limited for digital goods" />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Refund requests are evaluated under our Refund Policy. Because templates are digital
              downloads, refunds are not available for change of mind, wrong purchase, compatibility
              issues, or lack of technical knowledge.
            </p>
          </div>

          <div>
            <SectionTitle eyebrow="9. Support policy" title="Support scope" />
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <HelpCircle className="mt-0.5 h-4 w-4 text-gray-400" />
                Support includes guidance on installation and basic customization. We do not provide
                full custom development unless explicitly agreed.
              </p>
            </div>
          </div>

          <div>
            <SectionTitle eyebrow="10. Restrictions" title="What you may not do" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <PolicyCard title="No redistribution" icon={<AlertTriangle className="h-5 w-5" />}>
                You may not resell, redistribute, share, or publish templates or derivative versions
                as competing products or downloads.
              </PolicyCard>
              <PolicyCard title="No abuse or exploitation" icon={<AlertTriangle className="h-5 w-5" />}>
                You may not attempt to bypass security controls, scrape private resources, or misuse
                the marketplace in ways that harm Neokit or other customers.
              </PolicyCard>
            </div>
          </div>

          <div>
            <SectionTitle eyebrow="11. Termination" title="Account termination" />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              We may suspend or terminate access for violations of these Terms, suspected fraud, or
              misuse of licensing. Termination may result in loss of access without refund where
              permitted by law.
            </p>
          </div>

          <div>
            <SectionTitle eyebrow="12. Disclaimer" title="No warranty" />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Neokit is provided “as is” and “as available”. To the maximum extent permitted by
              law, we disclaim all warranties, express or implied, including merchantability,
              fitness for a particular purpose, and non-infringement.
            </p>
          </div>

          <div>
            <SectionTitle eyebrow="13. Limitation of liability" title="Limited liability" />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              To the maximum extent permitted by law, Neokit shall not be liable for indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or
              data, arising from or related to your use of the website or templates.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-600">
            <p className="font-semibold text-gray-900">Contact</p>
            <p className="mt-1">
              For questions about these Terms, email{' '}
              <a className="text-blue-600 hover:underline" href="mailto:support@neokit.com">
                support@neokit.com
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>

    <MarketplaceFooter />
  </div>
);

