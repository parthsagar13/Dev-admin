import { Code2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">CodeMarket</span>
        </div>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} CodeMarket. Premium developer templates.
        </p>
      </div>
    </footer>
  );
};
