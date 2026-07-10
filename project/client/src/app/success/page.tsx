import { Suspense } from 'react';
import { SuccessPage } from '@/views/SuccessPage';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SuccessPage />
    </Suspense>
  );
}
