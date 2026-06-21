export interface NDAFormData {
  purpose: string;
  effectiveDate: string;

  mndaTermType: 'expires' | 'continues';
  mndaTermYears: string;

  confidentialityTermType: 'years' | 'perpetuity';
  confidentialityTermYears: string;

  governingLaw: string;
  jurisdiction: string;
  modifications: string;

  party1Name: string;
  party1Title: string;
  party1Company: string;
  party1NoticeAddress: string;
  party1Date: string;

  party2Name: string;
  party2Title: string;
  party2Company: string;
  party2NoticeAddress: string;
  party2Date: string;
}

const today = new Date().toISOString().split('T')[0];

export const defaultFormData: NDAFormData = {
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: today,
  mndaTermType: 'expires',
  mndaTermYears: '1',
  confidentialityTermType: 'years',
  confidentialityTermYears: '1',
  governingLaw: '',
  jurisdiction: '',
  modifications: '',
  party1Name: '',
  party1Title: '',
  party1Company: '',
  party1NoticeAddress: '',
  party1Date: today,
  party2Name: '',
  party2Title: '',
  party2Company: '',
  party2NoticeAddress: '',
  party2Date: today,
};
