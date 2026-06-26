'use client';

import { useEffect, useState } from 'react';
import { DocConfig } from '@/lib/doc-configs';
import { API_BASE } from '@/lib/api';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-sm text-gray-900 min-h-5 border-b border-gray-200 pb-1">
        {value || <span className="text-gray-400 italic">—</span>}
      </div>
    </div>
  );
}

interface Props {
  config: DocConfig;
  fields: Record<string, string>;
}

export function DocumentPreview({ config, fields }: Props) {
  const [standardTerms, setStandardTerms] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/template-text/${config.docType}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setStandardTerms(data.text))
      .catch(() => setStandardTerms(''));
  }, [config.docType]);

  return (
    <article className="bg-white shadow-sm rounded border border-gray-200 p-8 max-w-2xl mx-auto text-sm font-serif leading-relaxed">
      <h1 className="text-xl font-bold text-center mb-6">{config.name}</h1>

      {config.sections.map(section => {
        const sectionFields = config.fields.filter(f => f.section === section.key);
        return (
          <section key={section.key} className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-4 border-b border-gray-300 pb-1">
              {section.title}
            </h2>
            <div>
              {sectionFields.map(f => (
                <Field key={f.key} label={f.label} value={fields[f.key] ?? ''} />
              ))}
            </div>
          </section>
        );
      })}

      <hr className="border-gray-300 my-6" />

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">
            Standard Terms
          </h2>
          {standardTerms && (
            <button
              onClick={() => setShowTerms(v => !v)}
              className="text-xs text-[#209dd7] hover:underline"
            >
              {showTerms ? 'Hide' : 'Show'} standard terms
            </button>
          )}
        </div>

        {!standardTerms && (
          <p className="text-xs text-gray-400 italic">Loading standard terms…</p>
        )}

        {standardTerms && !showTerms && (
          <p className="text-xs text-gray-500 italic">
            The standard terms for this agreement are incorporated by reference.
            Click &ldquo;Show standard terms&rdquo; to read them.
          </p>
        )}

        {standardTerms && showTerms && (
          <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto border border-gray-100 rounded p-3 bg-gray-50">
            {standardTerms}
          </div>
        )}
      </section>
    </article>
  );
}
