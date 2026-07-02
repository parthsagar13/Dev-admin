import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Code2 className="h-7 w-7 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">CodeMarket</span>
        </Link>
        <nav className="flex items-center gap-4">
          <a href="#templates" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Templates
          </a>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/login">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
