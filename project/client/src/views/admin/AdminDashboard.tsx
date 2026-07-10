'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, IndianRupee, ShoppingBag, Download, Users, FileStack } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '@/services/api';
import type { CommerceDashboardStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<CommerceDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getCommerceStats()
      .then(setStats)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue ?? 0}`, icon: IndianRupee },
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: ShoppingBag },
    { label: 'Paid Orders', value: stats?.paidOrders ?? 0, icon: ShoppingBag },
    { label: 'Downloads', value: stats?.totalDownloads ?? 0, icon: Download },
    { label: 'Templates Sold', value: stats?.templatesSold ?? 0, icon: FileStack },
    { label: 'Customers', value: stats?.customers ?? 0, icon: Users },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Commerce overview</p>
        </div>
        <Button asChild>
          <Link href="/admin/templates/upload">
            <Plus className="h-4 w-4" />
            Upload Template
          </Link>
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{label}</CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Latest Templates ({stats?.totalTemplates ?? 0} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats?.latestTemplates.length ? (
            <p className="text-gray-500">No templates uploaded yet</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.latestTemplates.map((template) => (
                <div key={template._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <Image
                    src={template.thumbnailUrl}
                    alt={template.title}
                    width={80}
                    height={48}
                    className="h-12 w-20 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">{template.title}</p>
                    <p className="text-sm text-gray-500">
                      {template.framework} · {template.purchaseCount ?? 0} sales
                    </p>
                  </div>
                  {template.isFree ? (
                    <Badge variant="free">Free</Badge>
                  ) : (
                    <Badge variant="premium">₹{template.price}</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
