'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import type { Template } from '@/types';
import { templateApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  framework: z.string().min(1, 'Framework is required'),
  category: z.string().min(1, 'Category is required'),
  currency: z.string().min(1, 'Currency is required'),
  isFree: z.boolean(),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
});

type FormData = z.infer<typeof schema>;

const FRAMEWORKS = ['HTML', 'React', 'Vue', 'Next.js', 'Nuxt', 'Angular', 'Svelte', 'Other'];
const CATEGORIES = ['Landing Page', 'Portfolio', 'Dashboard', 'E-commerce', 'Blog', 'SaaS', 'Other'];
const CURRENCIES = [
  { code: 'INR', label: 'INR (₹) — Indian Rupee' },
  { code: 'USD', label: 'USD ($) — US Dollar' },
  { code: 'EUR', label: 'EUR (€) — Euro' },
  { code: 'GBP', label: 'GBP (£) — British Pound' },
];

export const EditTemplate = ({ id }: { id: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      framework: '',
      category: '',
      currency: 'INR',
      isFree: true,
      price: 0,
    },
  });

  const isFree = watch('isFree');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    templateApi
      .getAll()
      .then((all) => {
        const found = all.find((t) => t._id === id) || null;
        setTemplate(found);
        if (!found) return;
        setValue('title', found.title);
        setValue('framework', found.framework);
        setValue('category', found.category);
        setValue('currency', found.currency || 'INR');
        setValue('isFree', found.isFree);
        setValue('price', found.price);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    try {
      setSaving(true);
      await templateApi.update(id, {
        title: data.title,
        framework: data.framework,
        category: data.category,
        currency: data.currency,
        isFree: data.isFree,
        price: data.isFree ? 0 : data.price,
      });
      toast.success('Template updated');
      router.push('/admin/templates');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const headerSubtitle = useMemo(() => {
    if (!template) return 'Update title, pricing, and listing details.';
    return `Editing “${template.title}”`;
  }, [template]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <p className="text-gray-600">Template not found.</p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/admin/templates">Back to templates</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/templates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Edit Template</h1>
          <p className="text-gray-500">{headerSubtitle}</p>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Template Name</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Framework</Label>
                <Select value={watch('framework')} onValueChange={(v) => setValue('framework', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAMEWORKS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.framework && <p className="text-sm text-red-500">{errors.framework.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={watch('category')} onValueChange={(v) => setValue('category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={watch('currency')} onValueChange={(v) => setValue('currency', v)}>
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
              <Switch checked={isFree} onCheckedChange={(checked) => setValue('isFree', checked)} />
            </div>

            {!isFree && (
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" min="0" {...register('price')} />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/templates')}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

