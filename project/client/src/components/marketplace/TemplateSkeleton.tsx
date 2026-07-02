import { Skeleton } from '@/components/ui/skeleton';
import { templateGridClass, templateGridSidebarClass } from '@/lib/layout';
import { cn } from '@/lib/utils';
export const TemplateCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
    <Skeleton className="aspect-video w-full rounded-none" />
    <div className="space-y-3 p-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

export const TemplateGridSkeleton = ({
  count = 6,
  sidebar = false,
}: {
  count?: number;
  sidebar?: boolean;
}) => (
  <div className={cn(sidebar ? templateGridSidebarClass : templateGridClass)}>    {Array.from({ length: count }).map((_, i) => (
      <TemplateCardSkeleton key={i} />
    ))}
  </div>
);
