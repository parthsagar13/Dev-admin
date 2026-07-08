import { cn } from '@/lib/utils';

export type TimelineItem = {
  title: string;
  description: string;
};

export const Timeline = ({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) => (
  <ol className={cn('relative space-y-6 border-l border-gray-200 pl-6', className)}>
    {items.map((item) => (
      <li key={item.title} className="relative">
        <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-sm" />
        <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
      </li>
    ))}
  </ol>
);

