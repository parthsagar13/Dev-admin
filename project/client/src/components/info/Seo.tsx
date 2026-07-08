import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  canonicalPath: string;
  ogTitle?: string;
  ogDescription?: string;
};

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const getCanonical = (path: string) => {
  const origin = window.location.origin;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${clean}`;
};

export const Seo = ({ title, description, canonicalPath, ogTitle, ogDescription }: SeoProps) => {
  useEffect(() => {
    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: ogTitle || title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: ogDescription || description,
    });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertLink('canonical', getCanonical(canonicalPath));
  }, [title, description, canonicalPath, ogTitle, ogDescription]);

  return null;
};

