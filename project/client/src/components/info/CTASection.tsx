import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CTASection = ({
  title,
  description,
  primary,
  secondary,
  right,
}: {
  title: string;
  description: string;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
  right?: ReactNode;
}) => (
  <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-10 text-white shadow-lg sm:px-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-white/80">{description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 bg-white px-8 text-base text-gray-900 hover:bg-white/90">
              <Link to={primary.to}>{primary.label}</Link>
            </Button>
            {secondary && (
              <Button
                asChild
                variant="outline"
                className="h-12 border-white/30 bg-transparent px-8 text-base text-white hover:bg-white/10"
              >
                <Link to={secondary.to}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </div>
        {right && <div className="hidden lg:block">{right}</div>}
      </div>
    </div>
  </section>
);

