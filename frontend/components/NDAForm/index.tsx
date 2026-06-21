'use client';

import { NDAFormData } from '@/lib/nda-types';
import { TermsSection } from './TermsSection';
import { PartiesSection } from './PartiesSection';

interface Props {
  data: NDAFormData;
  onChange: (updates: Partial<NDAFormData>) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function NDAForm({ data, onChange }: Props) {
  return (
    <form onSubmit={e => e.preventDefault()} className="max-w-xl">
      <Section title="Agreement Terms">
        <TermsSection data={data} onChange={onChange} />
      </Section>
      <Section title="Parties &amp; Signatures">
        <PartiesSection data={data} onChange={onChange} />
      </Section>
    </form>
  );
}
