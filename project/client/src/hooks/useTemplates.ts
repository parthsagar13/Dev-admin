'use client';

import { useEffect, useState } from 'react';
import { templateApi } from '@/services/api';
import type { Template } from '@/types';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    templateApi
      .getAll()
      .then(setTemplates)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load templates'))
      .finally(() => setLoading(false));
  }, []);

  return { templates, loading, error };
};
