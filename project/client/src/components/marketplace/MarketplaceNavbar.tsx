'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingCart, User } from 'lucide-react';
import { NeokitLogo } from '@/components/brand/NeokitLogo';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { marketplaceContainer } from '@/lib/layout';
import { cn } from '@/lib/utils';

interface MarketplaceNavbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

const navLinks = [
  { label: 'Templates', href: '/templates' },
  { label: 'Boilerplates', href: '/templates?category=Boilerplate' },
  { label: 'Components', href: '/templates?category=Components' },
];

export const MarketplaceNavbar = ({
  search = '',
  onSearchChange,
  showSearch = true,
}: MarketplaceNavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated: isAdmin } = useAuth();
  const { isAuthenticated: isUser } = useUserAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/templates?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/templates');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className={cn(marketplaceContainer, 'flex h-16 items-center gap-6')}>
        <Link href="/" className="flex shrink-0 items-center">
          <NeokitLogo size="lg" useWordmarkImage />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-600',
                pathname.startsWith('/templates') && link.label === 'Templates'
                  ? 'border-b-2 border-gray-900 pb-0.5 text-gray-900'
                  : 'text-gray-600'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {showSearch && (
          <form onSubmit={handleSearch} className="hidden flex-1 lg:block">
            <div className="relative mx-auto max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search templates..."
                className="h-10 rounded-full border-gray-200 bg-gray-50 pl-10"
              />
            </div>
          </form>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/templates"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            href={isUser ? '/dashboard' : '/login'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
            title={isUser ? 'My Dashboard' : 'Login'}
          >
            <User className="h-5 w-5" />
          </Link>
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="hidden text-xs text-gray-500 hover:text-gray-900 sm:block"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
