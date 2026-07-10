'use client';

import { cn } from '@/lib/utils';
import { BRAND_LOGO_SRC, BRAND_NAME } from '@/lib/brand';
import { NeokitIcon } from './NeokitIcon';

const sizeMap = {
  sm: { icon: 'h-8 w-8', logo: 'h-8' },
  md: { icon: 'h-9 w-9', logo: 'h-10' },
  lg: { icon: 'h-12 w-12', logo: 'h-14' },
} as const;

interface NeokitLogoProps {
  /** Show square icon only (navbar). Set false when using full wordmark image. */
  iconOnly?: boolean;
  /** Use full wordmark image (includes tagline in your PNG). */
  useWordmarkImage?: boolean;
  size?: keyof typeof sizeMap;
  className?: string;
}

/** Full wordmark image — your uploaded Neokit logo PNG */
export const NeokitWordmark = ({ className }: { className?: string }) => (
  <img
    src={BRAND_LOGO_SRC}
    alt={BRAND_NAME}
    className={cn('w-auto max-w-full object-contain', className)}
  />
);

export const NeokitLogo = ({
  iconOnly = false,
  useWordmarkImage = false,
  size = 'md',
  className,
}: NeokitLogoProps) => {
  const s = sizeMap[size];

  if (useWordmarkImage) {
    return (
      <NeokitWordmark className={cn(s.logo, className)} />
    );
  }

  if (iconOnly) {
    return <NeokitIcon className={cn(s.icon, className)} />;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <NeokitIcon className={s.icon} />
      <NeokitWordmark className={cn('max-h-10', s.logo)} />
    </div>
  );
};
