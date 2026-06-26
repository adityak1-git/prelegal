'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { listDocuments, SavedDocument } from '@/lib/documents-api';

export function useDocuments() {
  const auth = useAuth();
  const token = auth.status === 'authenticated' ? auth.token : null;
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const docs = await listDocuments(token);
      setDocuments(docs);
    } catch {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  return { documents, loading, error, refetch: fetchDocs };
}
