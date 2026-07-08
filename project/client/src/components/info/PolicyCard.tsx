import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PolicyCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) => (
  <Card className="border-gray-100 shadow-sm">
    <CardHeader className="flex flex-row items-center gap-3">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          {icon}
        </div>
      )}
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-sm leading-relaxed text-gray-600">{children}</CardContent>
  </Card>
);

