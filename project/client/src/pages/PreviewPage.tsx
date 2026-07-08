import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { templateApi } from '@/services/api';
import { getPreviewSrc } from '@/lib/preview';
import { useTemplateDownload } from '@/hooks/useTemplateDownload';
import type { Template } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/format';

export const PreviewPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const { download, isDownloading } = useTemplateDownload();

  useEffect(() => {
    if (!slug) return;
    templateApi
      .getBySlug(slug)
      .then(setTemplate)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDownload = () => {
    if (!template) return;
    download(template._id, template.slug);
  };

  const previewSrc = slug ? getPreviewSrc(slug) : '';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Template not found</p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to={`/templates/${template.slug}`}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold text-gray-900">{template.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{template.framework}</span>
              <span>&middot;</span>
              <span>{template.category}</span>
              {template.isFree ? (
                <Badge variant="free">Free</Badge>
              ) : (
                <Badge variant="premium">
                  {formatPrice(template.price, template.isFree, template.currency || 'INR')}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={previewSrc} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
          </Button>
          <Button size="sm" className="bg-gray-900 hover:bg-gray-800" onClick={handleDownload} disabled={template ? isDownloading(template._id) : false}>
            <Download className="h-4 w-4" />
            {template && isDownloading(template._id) ? 'Downloading...' : 'Download ZIP'}
          </Button>
        </div>
      </header>
      <iframe
        src={previewSrc}
        title={template.title}
        className="flex-1 w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
};
