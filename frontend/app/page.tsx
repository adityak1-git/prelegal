import Link from 'next/link';
import { DOC_CONFIGS } from '@/lib/doc-configs';

export default function Home() {
  const docs = Object.values(DOC_CONFIGS);

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Prelegal</span>
        <span className="text-xs text-gray-400">Powered by Common Paper</span>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-[#032147] mb-2">Legal Document Creator</h1>
          <p className="text-[#888888] mb-10">
            Choose a document type and our AI assistant will guide you through creating it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map(doc => (
              <Link
                key={doc.docType}
                href={`/create/${doc.docType}/`}
                className="group flex flex-col p-5 rounded-lg border border-gray-200 hover:border-[#209dd7] hover:shadow-md transition-all duration-150 bg-white"
              >
                <h2 className="text-sm font-semibold text-[#032147] mb-2 group-hover:text-[#209dd7] transition-colors">
                  {doc.name}
                </h2>
                <p className="text-xs text-[#888888] leading-relaxed flex-1">
                  {doc.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#209dd7]">
                  Create
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
