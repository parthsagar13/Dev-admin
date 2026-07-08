import { cn } from '@/lib/utils';

export const SectionTitle = ({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}) => (
  <div className={cn(align === 'center' ? 'text-center' : 'text-left')}>
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</p>
    )}
    <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h2>
    {description && <p className="mt-3 text-gray-600">{description}</p>}
  </div>
);

