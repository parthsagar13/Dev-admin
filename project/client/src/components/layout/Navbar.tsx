'use client';

import Link from 'next/link';
import { NeokitLogo } from '@/components/brand/NeokitLogo';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <NeokitLogo size="md" useWordmarkImage />
        </Link>
        <nav className="flex items-center gap-4">
          <a href="#templates" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Templates
          </a>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/login">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
