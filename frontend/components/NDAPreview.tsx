'use client';

import { NDAFormData } from '@/lib/nda-types';
import { mndaTermText, confidentialityTermText, STANDARD_TERMS, resolveTermBody } from '@/lib/nda-template';

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

function SignatureRow({ label, name, title, company, address, date }: {
  label: string;
  name: string;
  title: string;
  company: string;
  address: string;
  date: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs font-bold uppercase tracking-wide mb-3 text-gray-700">{label}</div>
      <div className="space-y-2">
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Signature</div>
          <div className="border-b border-gray-400 min-h-8 pb-1">
            {name && <span className="font-serif italic text-gray-700">{name}</span>}
          </div>
        </div>
        <Field label="Print Name" value={name} />
        <Field label="Title" value={title} />
        <Field label="Company" value={company} />
        <Field label="Notice Address" value={address} />
        <Field label="Date" value={date} />
      </div>
    </div>
  );
}

interface Props {
  data: NDAFormData;
}

export function NDAPreview({ data }: Props) {
  return (
    <article className="bg-white shadow-sm rounded border border-gray-200 p-8 max-w-2xl mx-auto text-sm font-serif leading-relaxed">
      <h1 className="text-xl font-bold text-center mb-1">Mutual Non-Disclosure Agreement</h1>
      <p className="text-xs text-center text-gray-500 mb-6">
        Common Paper MNDA Standard Terms Version 1.0
      </p>

      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-4 border-b border-gray-300 pb-1">
          Cover Page
        </h2>
        <Field label="Purpose" value={data.purpose} />
        <Field label="Effective Date" value={data.effectiveDate} />
        <Field label="MNDA Term" value={mndaTermText(data)} />
        <Field label="Term of Confidentiality" value={confidentialityTermText(data)} />
        <Field label="Governing Law" value={data.governingLaw} />
        <Field label="Jurisdiction" value={data.jurisdiction} />
        {data.modifications && (
          <Field label="MNDA Modifications" value={data.modifications} />
        )}
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-4 border-b border-gray-300 pb-1">
          Signatures
        </h2>
        <p className="text-xs text-gray-600 mb-4 italic">
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
        </p>
        <div className="flex gap-8">
          <SignatureRow
            label="Party 1"
            name={data.party1Name}
            title={data.party1Title}
            company={data.party1Company}
            address={data.party1NoticeAddress}
            date={data.party1Date}
          />
          <SignatureRow
            label="Party 2"
            name={data.party2Name}
            title={data.party2Title}
            company={data.party2Company}
            address={data.party2NoticeAddress}
            date={data.party2Date}
          />
        </div>
      </section>

      <hr className="border-gray-300 my-6" />

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 mb-4">
          Standard Terms
        </h2>
        <div className="space-y-4">
          {STANDARD_TERMS.map(term => (
            <div key={term.number}>
              <span className="font-bold">{term.number}. {term.title}.</span>{' '}
              <span className="text-gray-800">{resolveTermBody(term, data)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.
        </p>
      </section>
    </article>
  );
}
