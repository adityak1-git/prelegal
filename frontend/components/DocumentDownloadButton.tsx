'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { DocConfig } from '@/lib/doc-configs';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { saveDocument } from '@/lib/documents-api';
import { triggerBlobDownload } from '@/lib/download-utils';
import { DocumentPdfDocument } from './DocumentPdfDocument';

interface Props {
  config: DocConfig;
  fields: Record<string, string>;
}

export function DocumentDownloadButton({ config, fields }: Props) {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { addToast } = useToast();

  const getFilename = () => {
    const party1 = fields['party1Company'] || fields['party1Name'] || '';
    const party2 = fields['party2Company'] || fields['party2Name'] || '';
    const base = [party1, party2].filter(Boolean).join('-').replace(/\s+/g, '-').toLowerCase();
    return (base || config.docType) + '.pdf';
  };

  async function handleDownload() {
    setLoading(true);
    try {
      const filename = getFilename();
      const blob = await pdf(<DocumentPdfDocument config={config} fields={fields} />).toBlob();

      const token = auth.status === 'authenticated' ? auth.token : null;
      if (token) {
        try {
          await saveDocument(token, {
            doc_type: config.docType,
            doc_name: config.name,
            filename,
            field_values: fields,
          });
          addToast('Document saved to your history', 'success');
        } catch {
          addToast('Document downloaded but could not be saved to history', 'error');
        }
      } else {
        addToast('Sign in to save documents to your history', 'info');
      }

      triggerBlobDownload(blob, filename);
    } catch {
      addToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 rounded-md bg-[#209dd7] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a8abf] disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-wait"
    >
      {loading ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Preparing PDF…
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
          </svg>
          Download PDF
        </>
      )}
    </button>
  );
}
