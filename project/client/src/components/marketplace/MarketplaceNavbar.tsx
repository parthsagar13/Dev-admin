import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Code2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
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
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/templates?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/templates');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className={cn(marketplaceContainer, 'flex h-16 items-center gap-6')}>
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <Code2 className="h-7 w-7 text-blue-600" />
          <span className="text-lg font-bold tracking-tight">Code Market AI</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-600',
                location.pathname.startsWith('/templates') && link.label === 'Templates'
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
            to="/templates"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
