export const getPreviewSrc = (slug: string) => {
  if (process.env.NODE_ENV === 'development') {
    return `/api/preview/${slug}`;
  }

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const base = api.replace(/\/api\/?$/, '');
  return `${base}/api/preview/${slug}`;
};
