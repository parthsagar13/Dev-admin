import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { downloadApi, orderApi } from '@/services/api';
import { useUserAuth } from '@/context/UserAuthContext';
import { UserDashboardLayout } from './UserDashboardLayout';

export const UserDashboardPage = () => {
  const { user } = useUserAuth();
  const [downloadCount, setDownloadCount] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([downloadApi.getMyDownloads(), orderApi.getMyOrders()])
      .then(([downloads, orders]) => {
        setDownloadCount(downloads.length);
        setPurchaseCount(orders.filter((o) => o.status === 'paid').length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserDashboardLayout title="Dashboard" active="/dashboard">
      <p className="mb-6 text-gray-500">Welcome back, {user?.name}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Purchased Templates', value: loading ? '—' : purchaseCount },
          { label: 'Available Downloads', value: loading ? '—' : downloadCount },
          { label: 'Account', value: user?.email || '—' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-2 truncate text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        <Link
          to="/dashboard/downloads"
          className="rounded-xl border border-gray-100 bg-white px-6 py-4 text-sm font-medium shadow-sm hover:bg-gray-50"
        >
          View My Downloads →
        </Link>
        <Link
          to="/dashboard/purchases"
          className="rounded-xl border border-gray-100 bg-white px-6 py-4 text-sm font-medium shadow-sm hover:bg-gray-50"
        >
          View Purchase History →
        </Link>
      </div>
    </UserDashboardLayout>
  );
};
