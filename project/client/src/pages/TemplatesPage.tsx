import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List } from 'lucide-react';
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { TemplateMarketCard } from '@/components/marketplace/TemplateMarketCard';
import { TemplateGridSkeleton } from '@/components/marketplace/TemplateSkeleton';
import { EmptyState } from '@/components/marketplace/EmptyState';
import { Pagination } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTemplates } from '@/hooks/useTemplates';
import {
  defaultFilters,
  useFilteredTemplates,
  getUniqueFrameworks,
  getUniqueCategories,
  type TemplateFilters,
} from '@/hooks/useFilteredTemplates';
import { marketplaceContainer, templateGridSidebarClass } from '@/lib/layout';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 9;

export const TemplatesPage = () => {
  const [searchParams] = useSearchParams();
  const { templates, loading } = useTemplates();
  const [filters, setFilters] = useState<TemplateFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    setFilters((prev) => ({ ...prev, query: q, category }));
    setPage(1);
  }, [searchParams]);

  const filtered = useFilteredTemplates(templates, filters);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const frameworks = getUniqueFrameworks(templates);
  const categories = getUniqueCategories(templates);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <MarketplaceNavbar
        search={filters.query}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, query: q }))}
      />

      <div className={cn(marketplaceContainer, 'py-8')}>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            filters={filters}
            frameworks={frameworks}
            categories={categories}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
            onReset={() => {
              setFilters(defaultFilters);
              setPage(1);
            }}
          />

          <div>
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Browse Templates</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {filtered.length} premium templates found
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex rounded-lg border border-gray-200 p-1">
                  <button
                    type="button"
                    onClick={() => setView('grid')}
                    className={cn(
                      'rounded-md p-2',
                      view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-500'
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className={cn(
                      'rounded-md p-2',
                      view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-500'
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                <Select
                  value={filters.sort}
                  onValueChange={(v) => setFilters((prev) => ({ ...prev, sort: v }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="downloads">Most Downloads</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <TemplateGridSkeleton sidebar />
            ) : paginated.length === 0 ? (
              <EmptyState onAction={() => setFilters(defaultFilters)} actionLabel="Reset Filters" />
            ) : (
              <>
                <div
                  className={cn(
                    view === 'grid' ? templateGridSidebarClass : 'flex flex-col gap-4'
                  )}
                >
                  {paginated.map((t) => (
                    <TemplateMarketCard
                      key={t._id}
                      template={t}
                      variant={view === 'list' ? 'compact' : 'grid'}
                    />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  className="mt-10"
                />
              </>
            )}
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};
