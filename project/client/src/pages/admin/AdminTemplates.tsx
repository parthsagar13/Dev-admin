import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { templateApi } from '@/services/api';
import type { Template } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const AdminTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchTemplates = () => {
    templateApi
      .getAll()
      .then(setTemplates)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      setDeleting(id);
      await templateApi.delete(id);
      toast.success('Template deleted');
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-500">Manage all uploaded templates</p>
        </div>
        <Button asChild>
          <Link to="/admin/templates/upload">
            <Plus className="h-4 w-4" />
            Upload Template
          </Link>
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="mb-4 text-gray-500">No templates yet</p>
            <Button asChild>
              <Link to="/admin/templates/upload">Upload your first template</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Template</th>
                <th className="px-6 py-3 font-medium text-gray-500">Framework</th>
                <th className="px-6 py-3 font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 font-medium text-gray-500">Price</th>
                <th className="px-6 py-3 font-medium text-gray-500">Downloads</th>
                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map((template) => (
                <tr key={template._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={template.thumbnailUrl}
                        alt={template.title}
                        className="h-10 w-16 rounded object-cover"
                      />
                      <span className="font-medium text-gray-900">{template.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{template.framework}</td>
                  <td className="px-6 py-4 text-gray-600">{template.category}</td>
                  <td className="px-6 py-4">
                    {template.isFree ? (
                      <Badge variant="free">Free</Badge>
                    ) : (
                      <span className="font-medium">${template.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{template.downloads}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link to={`/preview/${template.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(template._id)}
                        disabled={deleting === template._id}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
