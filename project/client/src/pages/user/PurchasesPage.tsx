import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';
import { UserDashboardLayout } from './UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { orderApi } from '@/services/api';
import { useTemplateDownload } from '@/hooks/useTemplateDownload';
import type { OrderItem } from '@/types';
import { formatPrice } from '@/lib/format';

const statusVariant = (status: string) => {
  if (status === 'paid') return 'free' as const;
  if (status === 'failed') return 'premium' as const;
  return 'secondary' as const;
};

export const PurchasesPage = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { download, isDownloading } = useTemplateDownload();

  useEffect(() => {
    orderApi
      .getMyOrders()
      .then(setOrders)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserDashboardLayout title="My Purchases" active="/dashboard/purchases">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No purchases yet.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium">{order.template?.title || '—'}</td>
                  <td className="px-4 py-3">
                    {order.template
                      ? formatPrice(order.amount, order.template.isFree)
                      : `₹${order.amount}`}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{order.invoiceNumber || '—'}</td>
                  <td className="px-4 py-3">
                    {order.status === 'paid' && order.template && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => download(order.template!.id, order.template!.slug)}
                        disabled={isDownloading(order.template.id)}
                      >
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </UserDashboardLayout>
  );
};
