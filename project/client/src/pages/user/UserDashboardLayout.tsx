import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Download, Package, User, Receipt } from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { label: 'Overview', href: '/dashboard', icon: Package },
  { label: 'My Downloads', href: '/dashboard/downloads', icon: Download },
  { label: 'My Purchases', href: '/dashboard/purchases', icon: Receipt },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

export const UserDashboardLayout = ({
  children,
  title,
  active,
}: {
  children: ReactNode;
  title: string;
  active: string;
}) => (
  <div className="min-h-screen bg-gray-50">
    <MarketplaceNavbar showSearch={false} />
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <nav className="space-y-1">
            {sidebarLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active === href ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>
          <h1 className="mb-6 text-2xl font-bold text-gray-900">{title}</h1>
          {children}
        </div>
      </div>
    </div>
    <MarketplaceFooter />
  </div>
);
