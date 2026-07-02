import { Link } from 'react-router-dom';
import { Code2, Globe } from 'lucide-react';
import { marketplaceContainer } from '@/lib/layout';
import { cn } from '@/lib/utils';

const footerLinks = {
  marketplace: [
    { label: 'Templates', to: '/templates' },
    { label: 'Boilerplates', to: '/templates' },
    { label: 'Components', to: '/templates' },
    { label: 'UI Kits', to: '/templates' },
  ],
  company: [
    { label: 'Developer API', to: '#' },
    { label: 'Status', to: '#' },
    { label: 'Support', to: '#' },
    { label: 'Sell Your Code', to: '/admin/login' },
  ],
  legal: [
    { label: 'Terms of Service', to: '#' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'License Agreement', to: '#' },
  ],
};

export const MarketplaceFooter = () => (
  <footer className="border-t border-gray-100 bg-gray-50">
    <div className={cn(marketplaceContainer, 'py-14')}>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Code2 className="h-6 w-6 text-blue-600" />
            <span className="font-bold">Code Market AI</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-500">
            The premium marketplace for high-quality developer templates, boilerplates, and UI
            components.
          </p>
          <div className="mt-4 flex gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500">
              <Globe className="h-4 w-4" />
            </span>
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="mb-4 text-sm font-semibold capitalize text-gray-900">{title}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-500 transition-colors hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 text-sm text-gray-500 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Code Market AI. All rights reserved.</p>
        <p>Global | USD</p>
      </div>
    </div>
  </footer>
);
