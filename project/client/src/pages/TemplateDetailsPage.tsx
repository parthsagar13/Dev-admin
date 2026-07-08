import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Eye,
  ShoppingCart,
  Star,
  Clock,
  CheckCircle,
  Zap,
  Shield,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { TemplateMarketCard } from '@/components/marketplace/TemplateMarketCard';
import { TemplateGridSkeleton } from '@/components/marketplace/TemplateSkeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { templateApi, paymentApi } from '@/services/api';
import { useTemplateDownload } from '@/hooks/useTemplateDownload';
import { useUserAuth } from '@/context/UserAuthContext';
import { formatDownloads, formatPrice } from '@/lib/format';
import type { Template } from '@/types';

export const TemplateDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useUserAuth();
  const { download, isDownloading } = useTemplateDownload();
  const [template, setTemplate] = useState<Template | null>(null);
  const [related, setRelated] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([templateApi.getBySlug(slug), templateApi.getAll()])
      .then(([detail, all]) => {
        setTemplate(detail);
        setRelated(
          all
            .filter((t) => t._id !== detail._id && t.category === detail.category)
            .slice(0, 4)
        );
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleBuy = () => {
    if (!template) return;
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate(`/login?redirect=/templates/${template.slug}`);
      return;
    }
    if (template.isFree) {
      paymentApi
        .createOrder(template._id)
        .then(() => download(template._id, template.slug))
        .catch((err) => toast.error(err.message));
    } else {
      navigate(`/checkout/${template.slug}`);
    }
  };

  const handleFreeDownload = async () => {
    if (!template) return;
    if (!isAuthenticated) {
      toast.error('Please login to download');
      navigate(`/login?redirect=/templates/${template.slug}`);
      return;
    }
    try {
      if (template.isFree) {
        await paymentApi.createOrder(template._id);
      }
      await download(template._id, template.slug);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Download failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <MarketplaceNavbar showSearch={false} />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <TemplateGridSkeleton count={1} />
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Template not found</p>
        <Button asChild>
          <Link to="/templates">Browse Templates</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MarketplaceNavbar showSearch={false} />

      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-gray-500 sm:px-6 lg:px-8">
          <Link to="/templates" className="hover:text-gray-900">
            Marketplace
          </Link>
          <ChevronRight className="mx-1 inline h-4 w-4" />
          <span>{template.framework}</span>
          <ChevronRight className="mx-1 inline h-4 w-4" />
          <span className="text-gray-900">{template.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{template.title}</h1>
            <p className="mt-3 text-lg text-gray-500">
              A high-performance {template.category.toLowerCase()} template built with{' '}
              {template.framework}.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
              <img
                src={template.thumbnailUrl}
                alt={template.title}
                className="aspect-video w-full bg-white object-contain"
              />
            </div>
            {/* thumbnail strip removed per requirement */}

            <Tabs defaultValue="description" className="mt-10">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="technologies">Technologies</TabsTrigger>
                <TabsTrigger value="installation">Installation</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <h3 className="text-xl font-bold">Uncompromising Technical Excellence</h3>
                <p className="mt-4 leading-relaxed text-gray-600">
                  This {template.framework} template provides a production-ready foundation for your
                  next {template.category.toLowerCase()} project. Built with modern best practices,
                  it includes responsive layouts, clean code structure, and optimized assets ready
                  for deployment.
                </p>
                <p className="mt-4 leading-relaxed text-gray-600">
                  Preview the live demo, download the source ZIP, and start building immediately.
                </p>
              </TabsContent>
              <TabsContent value="features">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: Zap, title: 'Optimized Performance', desc: 'Lightweight and fast.' },
                    { icon: Shield, title: 'Secure by Design', desc: 'Best practices included.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="rounded-xl border border-gray-100 p-5">
                      <Icon className="mb-3 h-6 w-6 text-blue-600" />
                      <h4 className="font-semibold">{title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="technologies">
                <ul className="space-y-2 text-gray-600">
                  <li>• Framework: {template.framework}</li>
                  <li>• Category: {template.category}</li>
                  <li>• License: Commercial Use</li>
                </ul>
              </TabsContent>
              <TabsContent value="installation">
                <ol className="list-decimal space-y-2 pl-5 text-gray-600">
                  <li>Download the ZIP file</li>
                  <li>Extract to your project directory</li>
                  <li>Install dependencies and run the dev server</li>
                </ol>
              </TabsContent>
            </Tabs>

            {/* Reviews placeholder */}
            <div className="mt-12 rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
              <Star className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              <p className="font-medium">Reviews coming soon</p>
              <p className="text-sm">Be the first to review this template.</p>
            </div>
          </div>

          {/* Sticky purchase card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">
                    {formatPrice(template.price, template.isFree, template.currency || 'INR')}
                  </p>
                  <p className="text-sm text-gray-500">Commercial License</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Best Choice
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  className="h-12 w-full bg-gray-900 text-base hover:bg-gray-800"
                  onClick={handleBuy}
                  disabled={isDownloading(template._id)}
                >
                  {template.isFree ? 'Download Free' : 'Buy Now'}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full text-base"
                  onClick={handleFreeDownload}
                  disabled={isDownloading(template._id)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isDownloading(template._id) ? 'Downloading...' : template.isFree ? 'Download Free' : 'Download (if purchased)'}
                </Button>
                <Button asChild variant="outline" className="h-12 w-full text-base">
                  <Link to={`/preview/${template.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Live Preview
                  </Link>
                </Button>
              </div>

              <ul className="mt-6 space-y-3 border-t border-gray-100 pt-6 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Framework</span>
                  <span className="font-medium text-gray-900">{template.framework}</span>
                </li>
                <li className="flex justify-between">
                  <span>Downloads</span>
                  <span className="font-medium text-gray-900">{formatDownloads(template.downloads)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Rating</span>
                  <span className="flex items-center gap-1 font-medium text-gray-900">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    4.9
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Last Update</span>
                  <span className="flex items-center gap-1 font-medium text-gray-900">
                    <Clock className="h-4 w-4" />
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </li>
              </ul>

              <div className="mt-6 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
                  CM
                </div>
                <div>
                  <p className="font-semibold text-gray-900">CodeMarket</p>
                  <p className="text-xs text-gray-500">Elite Author</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-gray-100 pt-16">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Related Templates</h2>
                <p className="text-gray-500">Explore more in {template.category}</p>
              </div>
              <Link to="/templates" className="text-sm font-medium text-blue-600 hover:underline">
                View all templates →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((t) => (
                <TemplateMarketCard key={t._id} template={t} />
              ))}
            </div>
          </section>
        )}
      </div>

      <MarketplaceFooter />
    </div>
  );
};
