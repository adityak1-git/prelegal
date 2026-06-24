'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { getDocConfig, getDefaultFields } from '@/lib/doc-configs';
import { DocumentChat } from '@/components/DocumentChat';
import { DocumentPreview } from '@/components/DocumentPreview';

const DocumentDownloadButton = dynamic(
  () => import('./DocumentDownloadButton').then(m => m.DocumentDownloadButton),
  {
    ssr: false,
    loading: () => (
      <button disabled className="rounded-md bg-[#209dd7] px-4 py-2 text-sm font-medium text-white opacity-50 cursor-wait">
        Loading…
      </button>
    ),
  },
);

interface Props {
  docType: string;
}

export function DocumentCreator({ docType }: Props) {
  const config = getDocConfig(docType);
  const [fields, setFields] = useState<Record<string, string>>(
    config ? getDefaultFields(docType) : {},
  );

  function handleChange(updates: Record<string, string>) {
    setFields(prev => ({ ...prev, ...updates }));
  }

  if (!config) return null;

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Left: AI Chat */}
      <div className="w-[45%] shrink-0 flex flex-col overflow-hidden border-r border-gray-200 bg-white p-6">
        <DocumentChat docType={docType} config={config} onChange={handleChange} />
      </div>

      {/* Right: preview */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
          <span className="text-sm font-medium text-gray-600">Live Preview</span>
          <DocumentDownloadButton config={config} fields={fields} />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <DocumentPreview config={config} fields={fields} />
        </div>
      </div>
    </div>
  );
}
