'use client';

import { NDAFormData } from '@/lib/nda-types';

type PartyKey = 'party1' | 'party2';

interface PartyFields {
  name: string;
  title: string;
  company: string;
  noticeAddress: string;
  date: string;
}

// Explicit map avoids fragile string-template key construction
function makeNDAKey(party: PartyKey, field: keyof PartyFields): keyof NDAFormData {
  const map: Record<PartyKey, Record<keyof PartyFields, keyof NDAFormData>> = {
    party1: {
      name: 'party1Name',
      title: 'party1Title',
      company: 'party1Company',
      noticeAddress: 'party1NoticeAddress',
      date: 'party1Date',
    },
    party2: {
      name: 'party2Name',
      title: 'party2Title',
      company: 'party2Company',
      noticeAddress: 'party2NoticeAddress',
      date: 'party2Date',
    },
  };
  return map[party][field];
}

function getPartyFields(data: NDAFormData, party: PartyKey): PartyFields {
  return {
    name: data[makeNDAKey(party, 'name')] as string,
    title: data[makeNDAKey(party, 'title')] as string,
    company: data[makeNDAKey(party, 'company')] as string,
    noticeAddress: data[makeNDAKey(party, 'noticeAddress')] as string,
    date: data[makeNDAKey(party, 'date')] as string,
  };
}

function PartyCard({
  idPrefix,
  label,
  fields,
  onUpdate,
}: {
  idPrefix: string;
  label: string;
  fields: PartyFields;
  onUpdate: (field: keyof PartyFields, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{label}</h4>
      <div>
        <label htmlFor={`${idPrefix}-name`} className="block text-xs font-medium text-gray-600 mb-1">Print Name</label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          value={fields.name}
          onChange={e => onUpdate('name', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-title`} className="block text-xs font-medium text-gray-600 mb-1">Title</label>
        <input
          id={`${idPrefix}-title`}
          type="text"
          value={fields.title}
          onChange={e => onUpdate('title', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-company`} className="block text-xs font-medium text-gray-600 mb-1">Company</label>
        <input
          id={`${idPrefix}-company`}
          type="text"
          value={fields.company}
          onChange={e => onUpdate('company', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-address`} className="block text-xs font-medium text-gray-600 mb-1">
          Notice Address <span className="text-gray-400">(email or postal)</span>
        </label>
        <textarea
          id={`${idPrefix}-address`}
          rows={2}
          value={fields.noticeAddress}
          onChange={e => onUpdate('noticeAddress', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-date`} className="block text-xs font-medium text-gray-600 mb-1">Date</label>
        <input
          id={`${idPrefix}-date`}
          type="date"
          value={fields.date}
          onChange={e => onUpdate('date', e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

interface Props {
  data: NDAFormData;
  onChange: (updates: Partial<NDAFormData>) => void;
}

export function PartiesSection({ data, onChange }: Props) {
  function updateParty(party: PartyKey, field: keyof PartyFields, value: string) {
    onChange({ [makeNDAKey(party, field)]: value });
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <PartyCard
        idPrefix="party1"
        label="Party 1"
        fields={getPartyFields(data, 'party1')}
        onUpdate={(field, value) => updateParty('party1', field, value)}
      />
      <PartyCard
        idPrefix="party2"
        label="Party 2"
        fields={getPartyFields(data, 'party2')}
        onUpdate={(field, value) => updateParty('party2', field, value)}
      />
    </div>
  );
}
