import { Link } from 'react-router-dom';
import { Eye, Download, Search } from 'lucide-react';
import type { Template } from '@/types';
import { useTemplateDownload } from '@/hooks/useTemplateDownload';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';

interface TemplateCardProps {
  template: Template;
}

export const TemplateCard = ({ template }: TemplateCardProps) => {
  const { download, isDownloading } = useTemplateDownload();

  const handleDownload = () => download(template._id, template.slug);

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={template.thumbnailUrl}
          alt={template.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {template.isFree ? (
          <Badge variant="free" className="absolute left-3 top-3">Free</Badge>
        ) : (
          <Badge variant="premium" className="absolute left-3 top-3">Premium</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 truncate text-lg font-semibold text-gray-900">{template.title}</h3>
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
          <span>{template.framework}</span>
          <span>&middot;</span>
          <span>{template.category}</span>
        </div>
        <p className="mb-4 text-lg font-bold text-gray-900">
          {formatPrice(template.price, template.isFree, template.currency || 'INR')}
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1" size="sm">
            <Link to={`/preview/${template.slug}`}>
              <Eye className="h-4 w-4" />
              Preview
            </Link>
          </Button>
          <Button className="flex-1" size="sm" onClick={handleDownload} disabled={isDownloading(template._id)}>
            <Download className="h-4 w-4" />
            {isDownloading(template._id) ? '...' : 'Download'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface TemplateGridProps {
  templates: Template[];
  search: string;
  onSearchChange: (value: string) => void;
}

export const TemplateGrid = ({ templates, search, onSearchChange }: TemplateGridProps) => {
  const filtered = templates.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.framework.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return (
    <section id="templates" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Browse Templates</h2>
            <p className="mt-2 text-gray-500">Professional website templates ready to download</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-20 text-center">
            <p className="text-gray-500">No templates found</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((template) => (
              <TemplateCard key={template._id} template={template} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
