'use client';

import {
  BadgeCheck,
  Code2,
  Gauge,
  Headphones,
  Layers,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { HeroSection } from '@/components/info/HeroSection';
import { SectionTitle } from '@/components/info/SectionTitle';
import { PolicyCard } from '@/components/info/PolicyCard';
import { Timeline } from '@/components/info/Timeline';
import { CTASection } from '@/components/info/CTASection';

const story = [
  {
    title: 'The problem we kept solving',
    description:
      'Every project started with the same setup: layout, auth, dashboards, reusable UI, and deployment-ready structure. We wanted a faster, cleaner starting point.',
  },
  {
    title: 'A marketplace built for builders',
    description:
      'Neokit curates templates that ship like real products: organized code, predictable structure, modern components, and clear customization paths.',
  },
  {
    title: 'Quality you can verify before you buy',
    description:
      'Live previews, transparent tech stacks, and production-minded defaults make it easy to choose a template that fits your project from day one.',
  },
];

const why = [
  {
    title: 'Production‑ready templates',
    description:
      'Built with real-world patterns: scalable components, consistent styling, and practical project structure so you can deploy with confidence.',
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    title: 'Modern UI design',
    description:
      'Clean layouts, refined spacing, and premium typography. Your product looks credible from the first screenshot to the final release.',
    icon: <Layers className="h-5 w-5" />,
  },
  {
    title: 'Clean code',
    description:
      'Readable, maintainable code that’s easy to extend. Perfect for teams and solo developers who value long-term velocity.',
    icon: <Code2 className="h-5 w-5" />,
  },
  {
    title: 'Regular updates',
    description:
      'Templates evolve with the ecosystem. You get ongoing improvements and compatibility updates where applicable.',
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    title: 'Commercial license support',
    description:
      'Use templates in client work and commercial products (per license terms). Clear guidelines, no confusion.',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: 'Premium support',
    description:
      'Need help unblocking a build? We respond with practical guidance so you can ship faster and smarter.',
    icon: <Headphones className="h-5 w-5" />,
  },
];

const tech = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'React',
  'Next.js',
  'Vue',
  'Tailwind CSS',
  'Bootstrap',
  'Node.js',
  'Express.js',
  'MongoDB',
];

export const AboutPage = () => (
  <div className="min-h-screen bg-white">
    <MarketplaceNavbar showSearch={false} />

    <HeroSection
      eyebrow="About Neokit"
      icon={<Gauge className="h-3.5 w-3.5" />}
      title={
        <>
          Premium templates that help you{' '}
          <span className="text-blue-600">ship faster</span>.
        </>
      }
      description="Neokit is a premium marketplace for developers and teams who want production-ready templates—designed with modern UI, clean code, and performance in mind."
      primaryCta={{ label: 'Browse Premium Templates', to: '/templates' }}
      secondaryCta={{ label: 'Contact Support', to: '/contact' }}
    />

    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-10">
          <div>
            <SectionTitle
              eyebrow="Who we are"
              title="A marketplace built around production standards"
              description="We curate templates that feel like real products: thoughtful UX, scalable components, and practical defaults that reduce rework."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <PolicyCard title="Our mission" icon={<Rocket className="h-5 w-5" />}>
                Help developers build faster by providing premium templates that accelerate delivery
                without sacrificing quality.
              </PolicyCard>
              <PolicyCard title="Our vision" icon={<ShieldCheck className="h-5 w-5" />}>
                Make production-ready design and code accessible—so every builder can launch a
                polished product with confidence.
              </PolicyCard>
            </div>
          </div>

          <div>
            <SectionTitle
              eyebrow="Our story"
              title="From repeated setup work to reusable foundations"
              description="We created Neokit after years of rebuilding the same foundations—auth, dashboards, landing pages, and UI libraries—across different client and internal projects."
            />
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <Timeline items={story} />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <SectionTitle eyebrow="Why choose Neokit" title="Premium templates, thoughtfully built" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {why.map((item) => (
                <PolicyCard key={item.title} title={item.title} icon={item.icon}>
                  {item.description}
                </PolicyCard>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 shadow-sm">
            <SectionTitle
              eyebrow="Technologies we support"
              title="Modern stacks teams love to maintain"
              description="Our catalog includes HTML templates, React and Next.js starters, Vue templates, admin dashboards, landing pages, UI kits, SaaS starters, MERN starters, and reusable components."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:grid-cols-3">
        {[
          {
            title: 'Build faster',
            desc: 'Skip repetitive setup work and focus on product features.',
          },
          {
            title: 'Save development time',
            desc: 'Start from a solid foundation that’s easy to extend.',
          },
          {
            title: 'Ship production-ready',
            desc: 'Use templates designed for performance, scalability, and real users.',
          },
        ].map((g) => (
          <div key={g.title}>
            <p className="text-sm font-semibold text-gray-900">{g.title}</p>
            <p className="mt-2 text-sm text-gray-600">{g.desc}</p>
          </div>
        ))}
      </div>
    </main>

    <CTASection
      title="Ready to launch your next build with confidence?"
      description="Browse premium templates, preview live demos, and download production-ready ZIP files designed for modern web projects."
      primary={{ label: 'Browse Premium Templates', to: '/templates' }}
      secondary={{ label: 'View My Downloads', to: '/dashboard/downloads' }}
    />

    <MarketplaceFooter />
  </div>
);

