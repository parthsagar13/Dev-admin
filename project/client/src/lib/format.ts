export const formatPrice = (price: number, isFree: boolean, currency: string = 'INR') => {
  if (isFree) return 'Free';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toFixed(0)}`;
  }
};

export const formatDownloads = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
};
