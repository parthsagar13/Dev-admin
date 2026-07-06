export const formatPrice = (price: number, isFree: boolean) =>
  isFree ? 'Free' : `₹${price.toFixed(0)}`;

export const formatDownloads = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
};
