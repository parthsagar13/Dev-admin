export const getPreviewSrc = (slug: string) => {
  if (import.meta.env.DEV) {
    return `/api/preview/${slug}`;
  }

  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const base = api.replace(/\/api\/?$/, '');
  return `${base}/api/preview/${slug}`;
};
