import { AboutPage } from '@/views/info/AboutPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Neokit | Premium Website Template Marketplace',
  description:
    'Learn about Neokit—our mission, vision, and the quality standards behind our premium templates for HTML, React, Next.js, Vue, dashboards, UI kits, and SaaS starters.',
  openGraph: {
    title: 'About Neokit',
    description:
      'Learn about Neokit—our mission, vision, and the quality standards behind our premium templates.',
  },
};

export default function Page() {
  return <AboutPage />;
}
