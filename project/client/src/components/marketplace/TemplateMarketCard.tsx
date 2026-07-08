import { Link } from 'react-router-dom';
import { Code2, Download, Star } from 'lucide-react';
import type { Template } from '@/types';
import { formatDownloads, formatPrice } from '@/lib/format';
import { useTemplateDownload } from '@/hooks/useTemplateDownload';
import { cn } from '@/lib/utils';

interface TemplateMarketCardProps {
  template: Template;
  variant?: 'grid' | 'compact';
  className?: string;
}

export const TemplateMarketCard = ({
  template,
  variant = 'grid',
  className,
}: TemplateMarketCardProps) => {
  const { download, isDownloading } = useTemplateDownload();
  const priceLabel = formatPrice(template.price, template.isFree, template.currency || 'INR');

  if (variant === 'compact') {
    return (
      <Link
        to={`/templates/${template.slug}`}
        className={cn(
          'flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
          className
        )}
      >
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
          <img
            src={template.thumbnailUrl}
            alt={template.title}
            className="h-full w-full bg-white object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900">{template.title}</p>
          <p className="text-sm text-gray-500">{template.framework}</p>
        </div>
        <span
          className={cn(
            'shrink-0 text-sm font-bold',
            template.isFree ? 'text-emerald-600' : 'text-blue-600'
          )}
        >
          {priceLabel}
        </span>
      </Link>
    );
  }

  const description = `Professional ${template.framework} template for ${template.category.toLowerCase()} projects.`;

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        className
      )}
    >
      <Link
        to={`/templates/${template.slug}`}
        className="relative block aspect-video shrink-0 overflow-hidden bg-gray-100"
      >
        <img
          src={template.thumbnailUrl}
          alt={template.title}
          className="h-full w-full bg-white object-contain transition-transform duration-500 group-hover:scale-[1.01]"
          loading="lazy"
        />
        <span className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-700 backdrop-blur">
          {template.framework}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
          {template.category}
        </p>

        <div className="mt-1 flex items-start justify-between gap-2">
          <Link to={`/templates/${template.slug}`} className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-base font-bold text-gray-900 transition-colors group-hover:text-blue-600">
              {template.title}
            </h3>
          </Link>
          <span
            className={cn(
              'shrink-0 text-sm font-bold',
              template.isFree ? 'text-emerald-600' : 'text-gray-900'
            )}
          >
            {priceLabel}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-1 text-sm text-gray-500">{description}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex min-w-0 items-center gap-3 text-xs text-gray-500">
            <span className="flex shrink-0 items-center gap-1">
              <Code2 className="h-3.5 w-3.5" />
              {template.framework}
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              4.9
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {formatDownloads(template.downloads)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => download(template._id, template.slug)}
            disabled={isDownloading(template._id)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            aria-label="Download template"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
