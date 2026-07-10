'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '@/services/api';

export const AdminDownloads = () => {
  const [downloads, setDownloads] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDownloads()
      .then(setDownloads)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Downloads</h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Download Count</th>
              <th className="px-4 py-3">Last Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {downloads.map((item) => {
              const user = item.user as { name?: string; email?: string } | undefined;
              const template = item.template as { title?: string } | undefined;
              return (
                <tr key={String(item._id)}>
                  <td className="px-4 py-3">{user?.name || user?.email || '—'}</td>
                  <td className="px-4 py-3">{template?.title || '—'}</td>
                  <td className="px-4 py-3">{String(item.downloadCount)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {item.lastDownloadAt
                      ? new Date(String(item.lastDownloadAt)).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
