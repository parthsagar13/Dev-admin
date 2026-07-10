'use client';

import { cn } from '@/lib/utils';
import { BRAND_ICON_SRC, BRAND_NAME } from '@/lib/brand';

interface NeokitIconProps {
  className?: string;
}

export const NeokitIcon = ({ className }: NeokitIconProps) => (
  <img
    src={BRAND_ICON_SRC}
    alt={`${BRAND_NAME} icon`}
    className={cn('shrink-0 object-contain', className)}
  />
);
