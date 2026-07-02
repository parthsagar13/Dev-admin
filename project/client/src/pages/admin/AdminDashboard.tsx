import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileStack, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { templateApi } from '@/services/api';
import type { DashboardStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    templateApi
      .getDashboardStats()
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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Overview of your template marketplace</p>
        </div>
        <Button asChild>
          <Link to="/admin/templates/upload">
            <Plus className="h-4 w-4" />
            Upload Template
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Total Templates</CardTitle>
          <FileStack className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-gray-900">{stats?.totalTemplates ?? 0}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Latest Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats?.latestTemplates.length ? (
            <p className="text-gray-500">No templates uploaded yet</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.latestTemplates.map((template) => (
                <div key={template._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={template.thumbnailUrl}
                    alt={template.title}
                    className="h-12 w-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-gray-900">{template.title}</p>
                    <p className="text-sm text-gray-500">
                      {template.framework} &middot; {template.category}
                    </p>
                  </div>
                  {template.isFree ? (
                    <Badge variant="free">Free</Badge>
                  ) : (
                    <Badge variant="premium">${template.price}</Badge>
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
