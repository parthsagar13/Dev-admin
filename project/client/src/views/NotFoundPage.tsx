'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';

export const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col bg-white">
    <MarketplaceNavbar showSearch={false} />
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-gray-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 max-w-md text-gray-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild className="mt-8 bg-gray-900 hover:bg-gray-800">
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
    <MarketplaceFooter />
  </div>
);
