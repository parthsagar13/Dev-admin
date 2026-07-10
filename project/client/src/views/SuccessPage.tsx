'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Search, LayoutGrid, Star, Terminal } from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { Button } from '@/components/ui/button';
import { templateApi } from '@/services/api';
import { useTemplateDownload } from '@/hooks/useTemplateDownload';
import { formatPrice } from '@/lib/format';
import type { Template } from '@/types';

export const SuccessPage = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [template, setTemplate] = useState<Template | null>(null);
  const { download, isDownloading } = useTemplateDownload();

  useEffect(() => {
    if (slug) templateApi.getBySlug(slug).then(setTemplate).catch(() => {});
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceNavbar showSearch={false} />

      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Thank you for your purchase!</h1>
          <p className="mt-4 text-gray-500">
            Your order was successful. Download your template below.
          </p>

          {template && (
            <Button
              className="mt-8 h-12 bg-gray-900 px-8 hover:bg-gray-800"
              onClick={() => download(template._id, template.slug)}
              disabled={isDownloading(template._id)}
            >
              <Download className="mr-2 h-5 w-5" />
              {isDownloading(template._id) ? 'Downloading...' : 'Download Template'}
            </Button>
          )}

          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <Link href="/templates" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Search className="h-4 w-4" />
              Continue Browsing
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/dashboard/downloads" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <LayoutGrid className="h-4 w-4" />
              My Downloads
            </Link>
          </div>

          {template && (
            <div className="mt-10 grid gap-4 border-t border-gray-100 pt-8 sm:grid-cols-3">
              {[
                { label: 'Item', value: template.title },
                { label: 'License', value: 'Commercial Use' },
                { label: 'Total', value: formatPrice(template.price, template.isFree, template.currency || 'INR') },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-gray-50 p-4 text-left">
                  <p className="text-xs font-semibold uppercase text-gray-400">{item.label}</p>
                  <p className="mt-1 font-semibold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-blue-50 p-6">
            <Terminal className="mb-3 h-6 w-6 text-blue-600" />
            <h3 className="font-semibold">Getting Started</h3>
            <p className="mt-2 text-sm text-gray-600">Extract the ZIP and follow the README.</p>
            <a href="#" className="mt-3 inline-block text-sm font-medium text-blue-600">
              Documentation →
            </a>
          </div>
          <div className="rounded-2xl bg-gray-100 p-6">
            <Star className="mb-3 h-6 w-6 text-gray-600" />
            <h3 className="font-semibold">Help us improve</h3>
            <p className="mt-2 text-sm text-gray-600">Share your experience with this template.</p>
            <span className="mt-3 inline-block text-sm font-medium text-gray-600">Leave Review</span>
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};
