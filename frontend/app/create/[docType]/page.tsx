import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ALL_DOC_TYPES, DOC_CONFIGS } from '@/lib/doc-configs';
import { NDACreator } from '@/components/NDACreator';
import { DocumentCreator } from '@/components/DocumentCreator';

interface Props {
  params: Promise<{ docType: string }>;
}

export function generateStaticParams() {
  return ALL_DOC_TYPES.map(docType => ({ docType }));
}

export default async function CreatePage({ params }: Props) {
  const { docType } = await params;
  const config = DOC_CONFIGS[docType];
  if (!config) notFound();

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-400 uppercase tracking-wider hover:text-[#209dd7] transition-colors"
          >
            Prelegal
          </Link>
          <span className="text-gray-300">›</span>
          <h1 className="text-sm font-semibold text-gray-900">{config.name}</h1>
        </div>
        <span className="text-xs text-gray-400">Common Paper</span>
      </header>

      {docType === 'mutual-nda' ? (
        <NDACreator />
      ) : (
        <DocumentCreator docType={docType} />
      )}
    </div>
  );
}
