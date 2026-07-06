import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';
import { UserDashboardLayout } from './UserDashboardLayout';
import { TemplateGridSkeleton } from '@/components/marketplace/TemplateSkeleton';
import { Button } from '@/components/ui/button';
import { downloadApi } from '@/services/api';
import { useTemplateDownload } from '@/hooks/useTemplateDownload';
import type { DownloadItem } from '@/types';
import { formatPrice } from '@/lib/format';

export const DownloadsPage = () => {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { download, isDownloading } = useTemplateDownload();

  useEffect(() => {
    downloadApi
      .getMyDownloads()
      .then(setItems)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserDashboardLayout title="My Downloads" active="/dashboard/downloads">
      {loading ? (
        <TemplateGridSkeleton count={3} />
      ) : items.length === 0 ? (
        <p className="text-gray-500">No downloads yet. Purchase or claim a free template to get started.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
            >
              {item.template && (
                <>
                  <img
                    src={item.template.thumbnailUrl}
                    alt={item.template.title}
                    className="h-20 w-32 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.template.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.template.framework} · {formatPrice(item.template.price, item.template.isFree)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Purchased {new Date(item.purchasedAt).toLocaleDateString()} · Downloaded{' '}
                      {item.downloadCount} time{item.downloadCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button
                    onClick={() => download(item.template!.id, item.template!.slug)}
                    disabled={isDownloading(item.template.id)}
                    className="bg-gray-900 hover:bg-gray-800"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading(item.template.id) ? 'Downloading...' : 'Download'}
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </UserDashboardLayout>
  );
};
