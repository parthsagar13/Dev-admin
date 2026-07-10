'use client';

import { useMemo } from 'react';
import type { Template } from '@/types';

export interface TemplateFilters {
  query: string;
  frameworks: string[];
  category: string;
  maxPrice: number;
  sort: string;
}

export const defaultFilters: TemplateFilters = {
  query: '',
  frameworks: [],
  category: 'all',
  maxPrice: 250,
  sort: 'popular',
};

export const useFilteredTemplates = (templates: Template[], filters: TemplateFilters) => {
  return useMemo(() => {
    let result = [...templates];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.framework.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (filters.frameworks.length) {
      result = result.filter((t) => filters.frameworks.includes(t.framework));
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter((t) =>
        t.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    result = result.filter((t) => t.isFree || t.price <= filters.maxPrice);

    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'downloads':
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      default:
        result.sort((a, b) => b.downloads - a.downloads);
    }

    return result;
  }, [templates, filters]);
};

export const getUniqueFrameworks = (templates: Template[]) =>
  [...new Set(templates.map((t) => t.framework))].sort();

export const getUniqueCategories = (templates: Template[]) =>
  [...new Set(templates.map((t) => t.category))].sort();
