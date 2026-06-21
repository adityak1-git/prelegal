'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { defaultFormData } from '@/lib/nda-types';
import { NDAForm } from '@/components/NDAForm';
import { NDAPreview } from '@/components/NDAPreview';

const NDADownloadButton = dynamic(
  () => import('./NDADownloadButton').then(m => m.NDADownloadButton),
  { ssr: false, loading: () => (
    <button disabled className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-50 cursor-wait">
      Loading…
    </button>
  )},
);

export function NDACreator() {
  const [formData, setFormData] = useState(defaultFormData);

  function handleChange(updates: Partial<typeof formData>) {
    setFormData(prev => ({ ...prev, ...updates }));
  }

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Left: scrollable form */}
      <div className="w-[45%] shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-6">
        <NDAForm data={formData} onChange={handleChange} />
      </div>

      {/* Right: sticky header + scrollable preview */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
          <span className="text-sm font-medium text-gray-600">Live Preview</span>
          <NDADownloadButton data={formData} />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <NDAPreview data={formData} />
        </div>
      </div>
    </div>
  );
}
