'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { NDAPdfDocument } from './NDAPdfDocument';
import { NDAFormData } from '@/lib/nda-types';

interface Props {
  data: NDAFormData;
}

export function NDADownloadButton({ data }: Props) {
  const filename = [
    data.party1Company || data.party1Name,
    data.party2Company || data.party2Name,
  ]
    .filter(Boolean)
    .join('-')
    .replace(/\s+/g, '-')
    .toLowerCase() || 'mutual-nda';

  return (
    <PDFDownloadLink
      document={<NDAPdfDocument data={data} />}
      fileName={`${filename}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-wait"
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
      )}
    </PDFDownloadLink>
  );
}
