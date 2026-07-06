import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '@/services/api';
import { Badge } from '@/components/ui/badge';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getOrders()
      .then(setOrders)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const user = order.user as { name?: string; email?: string } | undefined;
              const template = order.template as { title?: string } | undefined;
              return (
                <tr key={String(order._id)}>
                  <td className="px-4 py-3 text-xs">{String(order.invoiceNumber || '—')}</td>
                  <td className="px-4 py-3">{user?.name || user?.email || '—'}</td>
                  <td className="px-4 py-3">{template?.title || '—'}</td>
                  <td className="px-4 py-3">₹{String(order.amount)}</td>
                  <td className="px-4 py-3"><Badge variant="secondary">{String(order.status)}</Badge></td>
                  <td className="px-4 py-3 text-gray-500">{new Date(String(order.createdAt)).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
