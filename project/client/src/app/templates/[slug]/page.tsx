import type { Metadata } from 'next';
import { TemplateDetailsPage } from '@/views/TemplateDetailsPage';
import { fetchTemplateBySlug } from '@/lib/api-server';
import { BRAND_NAME } from '@/lib/brand';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = await fetchTemplateBySlug(slug);

  if (!template) {
    return { title: 'Template Not Found' };
  }

  const title = template.title;
  const description = `${template.title} — ${template.framework} ${template.category} template on ${BRAND_NAME}. Preview live demo and download instantly.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${BRAND_NAME}`,
      description,
      images: template.thumbnailUrl ? [{ url: template.thumbnailUrl, alt: title }] : undefined,
      type: 'website',
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <TemplateDetailsPage slug={slug} />;
}
