import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const HeroSection = ({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  icon,
}: {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  primaryCta?: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  icon?: ReactNode;
}) => (
  <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white">
    <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-20">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
          {icon}
          <span>{eyebrow}</span>
        </div>
      )}
      <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        {title}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">{description}</p>

      {(primaryCta || secondaryCta) && (
        <div className={cn('mt-10 flex flex-col justify-center gap-3 sm:flex-row')}>
          {primaryCta && (
            <Button asChild className="h-12 bg-gray-900 px-8 text-base hover:bg-gray-800">
              <Link to={primaryCta.to}>{primaryCta.label}</Link>
            </Button>
          )}
          {secondaryCta && (
            <Button asChild variant="outline" className="h-12 px-8 text-base">
              <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  </section>
);

