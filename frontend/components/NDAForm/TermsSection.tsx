'use client';

import { NDAFormData } from '@/lib/nda-types';

interface Props {
  data: NDAFormData;
  onChange: (updates: Partial<NDAFormData>) => void;
}

export function TermsSection({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="purpose" className="block text-sm font-semibold text-gray-800 mb-1">
          Purpose
        </label>
        <p className="text-xs text-gray-500 mb-2">How Confidential Information may be used</p>
        <textarea
          id="purpose"
          rows={3}
          value={data.purpose}
          onChange={e => onChange({ purpose: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label htmlFor="effectiveDate" className="block text-sm font-semibold text-gray-800 mb-1">
          Effective Date
        </label>
        <input
          id="effectiveDate"
          type="date"
          value={data.effectiveDate}
          onChange={e => onChange({ effectiveDate: e.target.value })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-semibold text-gray-800 mb-1">MNDA Term</legend>
        <p className="text-xs text-gray-500 mb-2">The length of this MNDA</p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="mndaTermType"
              value="expires"
              checked={data.mndaTermType === 'expires'}
              onChange={() => onChange({ mndaTermType: 'expires' })}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">Expires</span>
            <input
              type="number"
              aria-label="MNDA term years"
              min="1"
              max="10"
              value={data.mndaTermYears}
              onChange={e => onChange({ mndaTermYears: e.target.value })}
              disabled={data.mndaTermType !== 'expires'}
              className="w-16 rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
            />
            <span className="text-sm text-gray-700">year(s) from Effective Date</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="mndaTermType"
              value="continues"
              checked={data.mndaTermType === 'continues'}
              onChange={() => onChange({ mndaTermType: 'continues' })}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">Continues until terminated</span>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="block text-sm font-semibold text-gray-800 mb-1">Term of Confidentiality</legend>
        <p className="text-xs text-gray-500 mb-2">How long Confidential Information is protected</p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="confidentialityTermType"
              value="years"
              checked={data.confidentialityTermType === 'years'}
              onChange={() => onChange({ confidentialityTermType: 'years' })}
              className="accent-blue-600"
            />
            <input
              type="number"
              aria-label="Confidentiality term years"
              min="1"
              max="10"
              value={data.confidentialityTermYears}
              onChange={e => onChange({ confidentialityTermYears: e.target.value })}
              disabled={data.confidentialityTermType !== 'years'}
              className="w-16 rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
            />
            <span className="text-sm text-gray-700">year(s) from Effective Date</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="confidentialityTermType"
              value="perpetuity"
              checked={data.confidentialityTermType === 'perpetuity'}
              onChange={() => onChange({ confidentialityTermType: 'perpetuity' })}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">In perpetuity</span>
          </label>
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="governingLaw" className="block text-sm font-semibold text-gray-800 mb-1">
            Governing Law
          </label>
          <input
            id="governingLaw"
            type="text"
            placeholder="e.g. Delaware"
            value={data.governingLaw}
            onChange={e => onChange({ governingLaw: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="jurisdiction" className="block text-sm font-semibold text-gray-800 mb-1">
            Jurisdiction
          </label>
          <input
            id="jurisdiction"
            type="text"
            placeholder="e.g. New Castle, DE"
            value={data.jurisdiction}
            onChange={e => onChange({ jurisdiction: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="modifications" className="block text-sm font-semibold text-gray-800 mb-1">
          MNDA Modifications <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          id="modifications"
          rows={3}
          placeholder="List any modifications to the Standard Terms…"
          value={data.modifications}
          onChange={e => onChange({ modifications: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
}
