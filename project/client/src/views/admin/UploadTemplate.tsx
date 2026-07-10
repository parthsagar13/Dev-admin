'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Loader2, Upload } from 'lucide-react';
import { templateApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const uploadSchema = z.object({
  title: z.string().min(1, 'Template name is required'),
  framework: z.string().min(1, 'Framework is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  currency: z.string().min(1, 'Currency is required'),
  isFree: z.boolean(),
});

type UploadForm = z.infer<typeof uploadSchema>;

const FRAMEWORKS = ['HTML', 'React', 'Vue', 'Next.js', 'Nuxt', 'Angular', 'Svelte', 'Other'];
const CATEGORIES = ['Landing Page', 'Portfolio', 'Dashboard', 'E-commerce', 'Blog', 'SaaS', 'Other'];
const CURRENCIES = [
  { code: 'INR', label: 'INR (₹) — Indian Rupee' },
  { code: 'USD', label: 'USD ($) — US Dollar' },
  { code: 'EUR', label: 'EUR (€) — Euro' },
  { code: 'GBP', label: 'GBP (£) — British Pound' },
];

export const UploadTemplate = () => {
  const router = useRouter();
  const [sourceZipFile, setSourceZipFile] = useState<File | null>(null);
  const [previewZipFile, setPreviewZipFile] = useState<File | null>(null);
  const [previewProjectFiles, setPreviewProjectFiles] = useState<FileList | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState<'zip' | 'files'>('zip');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      framework: '',
      category: '',
      price: 0,
      currency: 'INR',
      isFree: true,
    },
  });

  const isFree = watch('isFree');

  const onSubmit = async (data: UploadForm) => {
    if (!sourceZipFile) {
      toast.error('Please select a source ZIP file');
      return;
    }

    if (!sourceZipFile.name.endsWith('.zip')) {
      toast.error('Source must be a ZIP file');
      return;
    }

    if (previewMode === 'zip') {
      if (!previewZipFile) {
        toast.error('Please select a preview ZIP file');
        return;
      }
      if (!previewZipFile.name.endsWith('.zip')) {
        toast.error('Preview must be a ZIP file');
        return;
      }
    } else {
      if (!previewProjectFiles?.length) {
        toast.error('Please select your HTML project folder');
        return;
      }
      const hasHtml = Array.from(previewProjectFiles).some((f) => /\.html?$/i.test(f.name));
      if (!hasHtml) {
        toast.error('Preview folder must contain an index.html file');
        return;
      }
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('framework', data.framework);
    formData.append('category', data.category);
    formData.append('price', String(data.isFree ? 0 : data.price));
    formData.append('currency', data.currency || 'INR');
    formData.append('isFree', String(data.isFree));
    formData.append('sourceZip', sourceZipFile);

    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    if (previewMode === 'zip') {
      formData.append('previewZip', previewZipFile!);
    } else {
      Array.from(previewProjectFiles!).forEach((file) => {
        const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
        formData.append('previewFiles', file, relativePath);
      });
    }

    try {
      setUploading(true);
      await templateApi.upload(formData);
      toast.success('Template uploaded successfully');
      router.push('/admin/templates');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Template</h1>
        <p className="text-gray-500">Upload a ZIP file containing your website template</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Template Name</Label>
              <Input id="title" placeholder="Modern SaaS Landing" {...register('title')} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Framework</Label>
                <Select onValueChange={(v) => setValue('framework', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAMEWORKS.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.framework && <p className="text-sm text-red-500">{errors.framework.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={(v) => setValue('category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select defaultValue="INR" onValueChange={(v) => setValue('currency', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency && <p className="text-sm text-red-500">{errors.currency.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <Label>Free Template</Label>
                <p className="text-sm text-gray-500">Toggle off for premium templates</p>
              </div>
              <Switch
                checked={isFree}
                onCheckedChange={(checked) => setValue('isFree', checked)}
              />
            </div>

            {!isFree && (
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" min="0" {...register('price')} />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sourceZip">Source ZIP</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="sourceZip"
                  type="file"
                  accept=".zip,application/zip"
                  onChange={(e) => setSourceZipFile(e.target.files?.[0] || null)}
                />
              </div>
              {sourceZipFile && (
                <p className="text-sm text-gray-500">{sourceZipFile.name} ({(sourceZipFile.size / 1024 / 1024).toFixed(2)} MB)</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Preview Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="previewMode"
                    checked={previewMode === 'zip'}
                    onChange={() => setPreviewMode('zip')}
                  />
                  ZIP Archive
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="previewMode"
                    checked={previewMode === 'files'}
                    onChange={() => setPreviewMode('files')}
                  />
                  HTML/CSS/JS Folder
                </label>
              </div>
            </div>

            {previewMode === 'zip' ? (
              <div className="space-y-2">
                <Label htmlFor="previewZip">Preview ZIP</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="previewZip"
                    type="file"
                    accept=".zip,application/zip"
                    onChange={(e) => setPreviewZipFile(e.target.files?.[0] || null)}
                  />
                </div>
                {previewZipFile && (
                  <p className="text-sm text-gray-500">{previewZipFile.name} ({(previewZipFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="previewFiles">Preview Project Folder</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="previewFiles"
                    type="file"
                    multiple
                    // @ts-expect-error webkitdirectory is supported in Chromium browsers
                    webkitdirectory=""
                    directory=""
                    onChange={(e) => setPreviewProjectFiles(e.target.files)}
                  />
                </div>
                {previewProjectFiles && previewProjectFiles.length > 0 && (
                  <p className="text-sm text-gray-500">{previewProjectFiles.length} files selected</p>
                )}
                <p className="text-sm text-gray-500">Select the folder containing index.html, CSS, JS, and assets.</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail (optional)</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
              {thumbnailFile && (
                <p className="text-sm text-gray-500">{thumbnailFile.name}</p>
              )}
              <p className="text-sm text-gray-500">JPG, PNG, or WEBP. Shown on template cards.</p>
            </div>

            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Template
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
