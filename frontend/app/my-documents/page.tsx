'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { pdf } from '@react-pdf/renderer';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { useDocuments } from '@/hooks/useDocuments';
import { getDocConfig } from '@/lib/doc-configs';
import { SavedDocument } from '@/lib/documents-api';
import { triggerBlobDownload } from '@/lib/download-utils';
import { HeaderNav } from '@/components/HeaderNav';
import { AuthModal } from '@/components/AuthModal';

const DocumentPdfDocument = dynamic(
  () => import('@/components/DocumentPdfDocument').then(m => m.DocumentPdfDocument),
  { ssr: false },
);
const NDAPdfDocument = dynamic(
  () => import('@/components/NDAPdfDocument').then(m => m.NDAPdfDocument),
  { ssr: false },
);

function DocTypeTag({ docType }: { docType: string }) {
  const config = getDocConfig(docType);
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#209dd7]/10 text-[#209dd7]">
      {config?.name ?? docType}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function DocumentCard({ doc }: { doc: SavedDocument }) {
  const [downloading, setDownloading] = useState(false);
  const { addToast } = useToast();
  const config = getDocConfig(doc.doc_type);

  async function handleRedownload() {
    setDownloading(true);
    try {
      let blob: Blob;
      if (doc.doc_type === 'mutual-nda') {
        const { NDAPdfDocument: Comp } = await import('@/components/NDAPdfDocument');
        blob = await pdf(<Comp data={doc.field_values as never} />).toBlob();
      } else if (config) {
        const { DocumentPdfDocument: Comp } = await import('@/components/DocumentPdfDocument');
        blob = await pdf(<Comp config={config} fields={doc.field_values} />).toBlob();
      } else {
        addToast('Unknown document type', 'error');
        return;
      }
      triggerBlobDownload(blob, doc.filename);
    } catch {
      addToast('Failed to generate PDF', 'error');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex items-start justify-between p-5 rounded-xl border border-gray-200 bg-white hover:border-[#209dd7] hover:shadow-sm transition-all">
      <div className="min-w-0 flex-1 mr-4">
        <h3 className="text-sm font-semibold text-[#032147] mb-1 truncate">{doc.doc_name}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <DocTypeTag docType={doc.doc_type} />
          <span className="text-xs text-[#888888]">{formatDate(doc.created_at)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 truncate">{doc.filename}</p>
      </div>
      <button
        onClick={handleRedownload}
        disabled={downloading}
        className="shrink-0 flex items-center gap-1.5 rounded-lg bg-gray-100 hover:bg-[#209dd7] hover:text-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors disabled:opacity-50"
      >
        {downloading ? (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
          </svg>
        )}
        {downloading ? 'Preparing…' : 'Re-download'}
      </button>
    </div>
  );
}

export default function MyDocumentsPage() {
  const auth = useAuth();
  const { documents, loading, error } = useDocuments();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeaderNav pageTitle="My Documents" />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-[#032147] mb-2">My Documents</h1>
          <p className="text-[#888888] mb-8">Documents you download are saved here automatically.</p>

          {auth.status === 'loading' && (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 rounded-full border-2 border-[#209dd7] border-t-transparent animate-spin" />
            </div>
          )}

          {auth.status === 'unauthenticated' && (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#209dd7]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#209dd7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#032147] mb-2">Sign in to see your documents</h2>
              <p className="text-sm text-[#888888] mb-6 max-w-xs">
                Your downloaded documents are saved automatically when you&apos;re signed in.
              </p>
              <button
                onClick={() => setShowAuth(true)}
                className="rounded-xl bg-[#209dd7] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a8abf] transition-colors"
              >
                Sign in
              </button>
            </div>
          )}

          {auth.status === 'authenticated' && loading && (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 rounded-full border-2 border-[#209dd7] border-t-transparent animate-spin" />
            </div>
          )}

          {auth.status === 'authenticated' && !loading && error && (
            <p className="text-sm text-red-600 text-center py-8">{error}</p>
          )}

          {auth.status === 'authenticated' && !loading && !error && documents.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#032147] mb-2">No documents yet</h2>
              <p className="text-sm text-[#888888] mb-6">
                Documents you download will appear here.
              </p>
              <Link
                href="/"
                className="rounded-xl bg-[#209dd7] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a8abf] transition-colors"
              >
                Browse document catalog
              </Link>
            </div>
          )}

          {auth.status === 'authenticated' && !loading && !error && documents.length > 0 && (
            <div className="space-y-3">
              {documents.map(doc => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </div>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
