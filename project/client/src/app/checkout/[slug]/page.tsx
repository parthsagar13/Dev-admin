import { CheckoutPage } from '@/views/CheckoutPage';

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CheckoutPage slug={slug} />;
}
