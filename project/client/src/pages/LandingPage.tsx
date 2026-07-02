import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { TemplateMarketCard } from '@/components/marketplace/TemplateMarketCard';
import { TemplateGridSkeleton } from '@/components/marketplace/TemplateSkeleton';
import { useTemplates } from '@/hooks/useTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { marketplaceContainer, templateGridClass } from '@/lib/layout';
import { cn } from '@/lib/utils';

const techStack = ['React', 'Next.js', 'Vue.js', 'Angular', 'Tailwind', 'Node.js'];

const faqs = [
  {
    q: "What's included in a premium purchase?",
    a: 'Full source code, commercial license, lifetime updates, and direct author support.',
  },
  {
    q: 'Can I use templates for client projects?',
    a: 'Yes. All premium templates include a commercial license for client work.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Contact support within 14 days if a template does not match the listed description.',
  },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { templates, loading } = useTemplates();
  const [search, setSearch] = useState('');

  const featured = templates.slice(0, 6);
  const trending = [...templates].sort((a, b) => b.downloads - a.downloads).slice(0, 4);
  const recent = [...templates]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const freeTemplates = templates.filter((t) => t.isFree).slice(0, 2);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/templates${search ? `?q=${encodeURIComponent(search)}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <MarketplaceNavbar search={search} onSearchChange={setSearch} showSearch={false} />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            The Enterprise Marketplace
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Build Faster with Premium{' '}
            <span className="text-blue-600">Developer Assets</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Access curated templates, boilerplates, and UI kits. Preview live demos and download
            production-ready ZIP files instantly.
          </p>
          <form onSubmit={handleHeroSearch} className="mx-auto mt-10 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search marketplace..."
                className="h-12 rounded-full border-gray-200 pl-12 text-base shadow-sm"
              />
            </div>
            <Button type="submit" className="h-12 rounded-full bg-gray-900 px-8 hover:bg-gray-800">
              Search Marketplace
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            {['React', 'Next.js Admin', 'Vue.js SaaS', 'Tailwind Dashboard'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/templates?q=${encodeURIComponent(tag)}`)}
                className="transition-colors hover:text-blue-600"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-b border-gray-100 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 px-4">
          {techStack.map((tech) => (
            <div
              key={tech}
              className="flex min-w-[100px] flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                {tech[0]}
              </div>
              <span className="text-sm font-medium text-gray-700">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="py-16">
        <div className={marketplaceContainer}>
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Featured Templates</h2>
            <Link to="/templates" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <TemplateGridSkeleton count={6} />
          ) : (
            <div className={templateGridClass}>
              {featured.map((t) => (
                <TemplateMarketCard key={t._id} template={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="border-y border-gray-100 bg-gray-50/50 py-16">
          <div className={marketplaceContainer}>
            <h2 className="mb-8 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <TrendingUp className="h-6 w-6 text-red-500" />
              Trending This Week
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {trending.map((t) => (
                <TemplateMarketCard key={t._id} template={t} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dark feature */}
      <section className="bg-gray-950 py-20 text-white">
        <div className={cn(marketplaceContainer, 'grid items-center gap-12 lg:grid-cols-2')}>
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Engineered for Modern Teams</h2>
            <p className="mt-4 text-gray-400">
              Every template is reviewed for code quality, performance, and maintainability before
              listing on Code Market AI.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Shield, label: 'Vetted Quality' },
                { icon: Zap, label: 'High Performance' },
                { icon: Headphones, label: 'Direct Support' },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8">
            <div className="aspect-video rounded-xl bg-gray-700/50" />
            <span className="absolute bottom-12 right-12 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold">
              99.9% Customer Satisfaction
            </span>
          </div>
        </div>
      </section>

      {/* Recent + Free */}
      <section className="py-16">
        <div className={cn(marketplaceContainer, 'grid gap-10 lg:grid-cols-2')}>
          <div>
            <h3 className="mb-6 text-xl font-bold">Recently Added</h3>
            <div className="space-y-3">
              {recent.map((t) => (
                <TemplateMarketCard key={t._id} template={t} variant="compact" />
              ))}
              {!recent.length && !loading && (
                <p className="text-sm text-gray-500">No templates yet.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-6 text-xl font-bold">Free Community Assets</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {freeTemplates.map((t) => (
                <TemplateMarketCard key={t._id} template={t} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-y border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h3 className="text-2xl font-bold">Never miss a drop.</h3>
          <p className="mt-2 text-gray-500">Get notified when new templates are added.</p>
          <div className="mt-6 flex gap-2">
            <Input placeholder="Email address" className="h-12 rounded-full bg-white" />
            <Button className="h-12 shrink-0 rounded-full bg-gray-900 px-6 hover:bg-gray-800">
              Join 50k+ Developers
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <MarketplaceFooter />
    </div>
  );
};
