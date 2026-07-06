import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { Button } from '@/components/ui/button';

export const PaymentFailedPage = () => (
  <div className="min-h-screen bg-gray-50">
    <MarketplaceNavbar showSearch={false} />
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
        <p className="mt-4 text-gray-500">
          Your payment could not be processed. No charges were made. Please try again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-gray-900 hover:bg-gray-800">
            <Link to="/templates">Browse Templates</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard/purchases">My Purchases</Link>
          </Button>
        </div>
      </div>
    </div>
    <MarketplaceFooter />
  </div>
);
