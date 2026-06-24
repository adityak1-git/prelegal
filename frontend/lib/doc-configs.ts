export interface FieldDef {
  key: string;
  label: string;
  defaultValue?: string;
  section: string;
}

export interface SectionDef {
  key: string;
  title: string;
}

export interface DocConfig {
  docType: string;
  name: string;
  description: string;
  templateFile: string;
  party1Label: string;
  party2Label: string;
  sections: SectionDef[];
  fields: FieldDef[];
}

const COMMON_PARTY_FIELDS = (
  party1Label: string,
  party2Label: string,
): FieldDef[] => [
  { key: 'party1Company', label: `${party1Label} Company`, section: 'party1' },
  { key: 'party1Name', label: `${party1Label} Signatory Name`, section: 'party1' },
  { key: 'party1Title', label: `${party1Label} Title`, section: 'party1' },
  { key: 'party1NoticeAddress', label: `${party1Label} Notice Address`, section: 'party1' },
  { key: 'party1Date', label: `${party1Label} Date`, defaultValue: 'TODAY', section: 'party1' },
  { key: 'party2Company', label: `${party2Label} Company`, section: 'party2' },
  { key: 'party2Name', label: `${party2Label} Signatory Name`, section: 'party2' },
  { key: 'party2Title', label: `${party2Label} Title`, section: 'party2' },
  { key: 'party2NoticeAddress', label: `${party2Label} Notice Address`, section: 'party2' },
  { key: 'party2Date', label: `${party2Label} Date`, defaultValue: 'TODAY', section: 'party2' },
];

// Shared field list for both Mutual NDA doc types (identical fields, different template)
const MNDA_SECTIONS: SectionDef[] = [
  { key: 'cover-page', title: 'Cover Page' },
  { key: 'party1', title: 'Party 1' },
  { key: 'party2', title: 'Party 2' },
];

const MNDA_FIELDS: FieldDef[] = [
  { key: 'purpose', label: 'Purpose', defaultValue: 'Evaluating whether to enter into a business relationship with the other party.', section: 'cover-page' },
  { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'cover-page' },
  { key: 'mndaTermType', label: 'MNDA Term', defaultValue: 'expires', section: 'cover-page' },
  { key: 'mndaTermYears', label: 'MNDA Term (Years)', defaultValue: '1', section: 'cover-page' },
  { key: 'confidentialityTermType', label: 'Confidentiality Term', defaultValue: 'years', section: 'cover-page' },
  { key: 'confidentialityTermYears', label: 'Confidentiality Term (Years)', defaultValue: '1', section: 'cover-page' },
  { key: 'governingLaw', label: 'Governing Law', section: 'cover-page' },
  { key: 'jurisdiction', label: 'Jurisdiction', section: 'cover-page' },
  { key: 'modifications', label: 'Modifications', section: 'cover-page' },
  ...COMMON_PARTY_FIELDS('Party 1', 'Party 2'),
];

export const DOC_CONFIGS: Record<string, DocConfig> = {
  'mutual-nda': {
    docType: 'mutual-nda',
    name: 'Mutual Non-Disclosure Agreement',
    description: 'Standard terms for a mutual non-disclosure agreement.',
    templateFile: 'Mutual-NDA.md',
    party1Label: 'Party 1',
    party2Label: 'Party 2',
    sections: MNDA_SECTIONS,
    fields: MNDA_FIELDS,
  },

  'mutual-nda-coverpage': {
    docType: 'mutual-nda-coverpage',
    name: 'Mutual NDA Cover Page',
    description: 'Cover page for the Common Paper Mutual NDA.',
    templateFile: 'Mutual-NDA-coverpage.md',
    party1Label: 'Party 1',
    party2Label: 'Party 2',
    sections: MNDA_SECTIONS,
    fields: MNDA_FIELDS,
    ],
  },

  'csa': {
    docType: 'csa',
    name: 'Cloud Service Agreement',
    description: 'Standard agreement for cloud software and SaaS products.',
    templateFile: 'CSA.md',
    party1Label: 'Provider',
    party2Label: 'Customer',
    sections: [
      { key: 'agreement-terms', title: 'Agreement Terms' },
      { key: 'party1', title: 'Provider' },
      { key: 'party2', title: 'Customer' },
    ],
    fields: [
      { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'agreement-terms' },
      { key: 'productName', label: 'Product Name', section: 'agreement-terms' },
      { key: 'subscriptionPeriod', label: 'Subscription Period', section: 'agreement-terms' },
      { key: 'orderDate', label: 'Order Date', section: 'agreement-terms' },
      { key: 'paymentProcess', label: 'Payment Process', section: 'agreement-terms' },
      { key: 'governingLaw', label: 'Governing Law', section: 'agreement-terms' },
      { key: 'chosenCourts', label: 'Chosen Courts', section: 'agreement-terms' },
      { key: 'generalCapAmount', label: 'General Liability Cap', section: 'agreement-terms' },
      ...COMMON_PARTY_FIELDS('Provider', 'Customer'),
    ],
  },

  'design-partner': {
    docType: 'design-partner',
    name: 'Design Partner Agreement',
    description: 'Agreement for early-access design partners who test a product and provide feedback.',
    templateFile: 'design-partner-agreement.md',
    party1Label: 'Provider',
    party2Label: 'Partner',
    sections: [
      { key: 'agreement-terms', title: 'Agreement Terms' },
      { key: 'party1', title: 'Provider' },
      { key: 'party2', title: 'Partner' },
    ],
    fields: [
      { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'agreement-terms' },
      { key: 'term', label: 'Term Duration', section: 'agreement-terms' },
      { key: 'productDescription', label: 'Product Description', section: 'agreement-terms' },
      { key: 'programDescription', label: 'Program Description', section: 'agreement-terms' },
      { key: 'fees', label: 'Fees', section: 'agreement-terms' },
      { key: 'governingLaw', label: 'Governing Law', section: 'agreement-terms' },
      { key: 'chosenCourts', label: 'Chosen Courts', section: 'agreement-terms' },
      ...COMMON_PARTY_FIELDS('Provider', 'Partner'),
    ],
  },

  'sla': {
    docType: 'sla',
    name: 'Service Level Agreement',
    description: 'Agreement defining uptime and response time commitments for cloud services.',
    templateFile: 'sla.md',
    party1Label: 'Provider',
    party2Label: 'Customer',
    sections: [
      { key: 'service-levels', title: 'Service Levels' },
      { key: 'party1', title: 'Provider' },
      { key: 'party2', title: 'Customer' },
    ],
    fields: [
      { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'service-levels' },
      { key: 'targetUptime', label: 'Target Uptime', section: 'service-levels' },
      { key: 'responseTimeP1', label: 'Response Time — Priority 1 (Critical)', section: 'service-levels' },
      { key: 'responseTimeP2', label: 'Response Time — Priority 2 (Major)', section: 'service-levels' },
      { key: 'responseTimeP3', label: 'Response Time — Priority 3 (Minor)', section: 'service-levels' },
      { key: 'supportChannel', label: 'Support Channel', section: 'service-levels' },
      { key: 'serviceCredit', label: 'Service Credit', section: 'service-levels' },
      { key: 'scheduledDowntime', label: 'Scheduled Downtime Window', section: 'service-levels' },
      ...COMMON_PARTY_FIELDS('Provider', 'Customer'),
    ],
  },

  'psa': {
    docType: 'psa',
    name: 'Professional Services Agreement',
    description: 'Standard agreement for professional services engagements.',
    templateFile: 'psa.md',
    party1Label: 'Provider',
    party2Label: 'Customer',
    sections: [
      { key: 'agreement-terms', title: 'Agreement Terms' },
      { key: 'party1', title: 'Provider' },
      { key: 'party2', title: 'Customer' },
    ],
    fields: [
      { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'agreement-terms' },
      { key: 'servicesDescription', label: 'Services Description', section: 'agreement-terms' },
      { key: 'deliverables', label: 'Deliverables', section: 'agreement-terms' },
      { key: 'fees', label: 'Fees', section: 'agreement-terms' },
      { key: 'paymentPeriod', label: 'Payment Terms', section: 'agreement-terms' },
      { key: 'governingLaw', label: 'Governing Law', section: 'agreement-terms' },
      { key: 'chosenCourts', label: 'Chosen Courts', section: 'agreement-terms' },
      { key: 'generalCapAmount', label: 'General Liability Cap', section: 'agreement-terms' },
      ...COMMON_PARTY_FIELDS('Provider', 'Customer'),
    ],
  },

  'dpa': {
    docType: 'dpa',
    name: 'Data Processing Agreement',
    description: 'Agreement governing the processing of personal data in compliance with GDPR.',
    templateFile: 'DPA.md',
    party1Label: 'Processor (Provider)',
    party2Label: 'Controller (Customer)',
    sections: [
      { key: 'data-processing', title: 'Data Processing Terms' },
      { key: 'party1', title: 'Processor (Provider)' },
      { key: 'party2', title: 'Controller (Customer)' },
    ],
    fields: [
      { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'data-processing' },
      { key: 'parentAgreement', label: 'Parent Agreement', section: 'data-processing' },
      { key: 'categoriesPersonalData', label: 'Categories of Personal Data', section: 'data-processing' },
      { key: 'categoriesDataSubjects', label: 'Categories of Data Subjects', section: 'data-processing' },
      { key: 'purposeProcessing', label: 'Purpose of Processing', section: 'data-processing' },
      { key: 'dataRetentionPeriod', label: 'Data Retention Period', section: 'data-processing' },
      { key: 'dataTransferMechanism', label: 'Data Transfer Mechanism', section: 'data-processing' },
      { key: 'breachNotificationPeriod', label: 'Breach Notification Period', section: 'data-processing' },
      ...COMMON_PARTY_FIELDS('Processor (Provider)', 'Controller (Customer)'),
    ],
  },

  'software-license': {
    docType: 'software-license',
    name: 'Software License Agreement',
    description: 'Standard agreement for licensing software to customers.',
    templateFile: 'Software-License-Agreement.md',
    party1Label: 'Provider',
    party2Label: 'Customer',
    sections: [
      { key: 'license-terms', title: 'License Terms' },
      { key: 'party1', title: 'Provider' },
      { key: 'party2', title: 'Customer' },
    ],
    fields: [
      { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'license-terms' },
      { key: 'productName', label: 'Product / Software Name', section: 'license-terms' },
      { key: 'licenseType', label: 'License Type', section: 'license-terms' },
      { key: 'subscriptionPeriod', label: 'Subscription Period', section: 'license-terms' },
      { key: 'licenseFees', label: 'License Fees', section: 'license-terms' },
      { key: 'paymentProcess', label: 'Payment Terms', section: 'license-terms' },
      { key: 'governingLaw', label: 'Governing Law', section: 'license-terms' },
      { key: 'chosenCourts', label: 'Chosen Courts', section: 'license-terms' },
      { key: 'generalCapAmount', label: 'General Liability Cap', section: 'license-terms' },
      ...COMMON_PARTY_FIELDS('Provider', 'Customer'),
    ],
  },

  'partnership': {
    docType: 'partnership',
    name: 'Partnership Agreement',
    description: 'Standard agreement for establishing business partnerships.',
    templateFile: 'Partnership-Agreement.md',
    party1Label: 'Company',
    party2Label: 'Partner',
    sections: [
      { key: 'partnership-terms', title: 'Partnership Terms' },
      { key: 'party1', title: 'Company' },
      { key: 'party2', title: 'Partner' },
    ],
    fields: [
      { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'partnership-terms' },
      { key: 'endDate', label: 'End Date', section: 'partnership-terms' },
      { key: 'partnershipObligations', label: 'Partnership Obligations', section: 'partnership-terms' },
      { key: 'paymentSchedule', label: 'Payment Schedule', section: 'partnership-terms' },
      { key: 'territory', label: 'Territory', section: 'partnership-terms' },
      { key: 'governingLaw', label: 'Governing Law', section: 'partnership-terms' },
      { key: 'chosenCourts', label: 'Chosen Courts', section: 'partnership-terms' },
      ...COMMON_PARTY_FIELDS('Company', 'Partner'),
    ],
  },

  'pilot': {
    docType: 'pilot',
    name: 'Pilot Agreement',
    description: 'Agreement for short-term pilot or trial access to a product.',
    templateFile: 'Pilot-Agreement.md',
    party1Label: 'Provider',
    party2Label: 'Customer',
    sections: [
      { key: 'pilot-terms', title: 'Pilot Terms' },
      { key: 'party1', title: 'Provider' },
      { key: 'party2', title: 'Customer' },
    ],
    fields: [
      { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'pilot-terms' },
      { key: 'productDescription', label: 'Product Description', section: 'pilot-terms' },
      { key: 'evaluationPurposes', label: 'Evaluation Purposes', section: 'pilot-terms' },
      { key: 'pilotPeriod', label: 'Pilot Period', section: 'pilot-terms' },
      { key: 'generalCapAmount', label: 'General Liability Cap', section: 'pilot-terms' },
      { key: 'governingLaw', label: 'Governing Law', section: 'pilot-terms' },
      { key: 'chosenCourts', label: 'Chosen Courts', section: 'pilot-terms' },
      ...COMMON_PARTY_FIELDS('Provider', 'Customer'),
    ],
  },

  'baa': {
    docType: 'baa',
    name: 'Business Associate Agreement',
    description: 'HIPAA-compliant agreement governing the handling of protected health information.',
    templateFile: 'BAA.md',
    party1Label: 'Business Associate',
    party2Label: 'Covered Entity',
    sections: [
      { key: 'baa-terms', title: 'BAA Terms' },
      { key: 'party1', title: 'Business Associate (Provider)' },
      { key: 'party2', title: 'Covered Entity' },
    ],
    fields: [
      { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'baa-terms' },
      { key: 'parentAgreement', label: 'Parent Agreement', section: 'baa-terms' },
      { key: 'phiCategories', label: 'PHI Categories', section: 'baa-terms' },
      { key: 'permittedUses', label: 'Permitted Uses of PHI', section: 'baa-terms' },
      { key: 'breachNotificationPeriod', label: 'Breach Notification Period', section: 'baa-terms' },
      ...COMMON_PARTY_FIELDS('Business Associate', 'Covered Entity'),
    ],
  },

  'ai-addendum': {
    docType: 'ai-addendum',
    name: 'AI Addendum',
    description: 'Addendum covering AI/ML service use, model training restrictions, and IP ownership.',
    templateFile: 'AI-Addendum.md',
    party1Label: 'Provider',
    party2Label: 'Customer',
    sections: [
      { key: 'addendum-terms', title: 'Addendum Terms' },
      { key: 'party1', title: 'Provider' },
      { key: 'party2', title: 'Customer' },
    ],
    fields: [
      { key: 'effectiveDate', label: 'Effective Date', defaultValue: 'TODAY', section: 'addendum-terms' },
      { key: 'baseAgreement', label: 'Base Agreement', section: 'addendum-terms' },
      { key: 'aiServicesDescription', label: 'AI Services Description', section: 'addendum-terms' },
      { key: 'trainingDataRestrictions', label: 'Training Data Restrictions', section: 'addendum-terms' },
      { key: 'modelImprovementRestrictions', label: 'Model Improvement Restrictions', section: 'addendum-terms' },
      ...COMMON_PARTY_FIELDS('Provider', 'Customer'),
    ],
  },
};

export const NDA_DOC_TYPES = new Set(['mutual-nda', 'mutual-nda-coverpage']);

export function getDocConfig(docType: string): DocConfig | undefined {
  return DOC_CONFIGS[docType];
}

export function getDefaultFields(docType: string): Record<string, string> {
  const config = DOC_CONFIGS[docType];
  if (!config) return {};
  const today = new Date().toISOString().split('T')[0];
  return Object.fromEntries(
    config.fields
      .filter(f => f.defaultValue !== undefined)
      .map(f => [f.key, f.defaultValue === 'TODAY' ? today : f.defaultValue!])
  );
}

export const ALL_DOC_TYPES = Object.keys(DOC_CONFIGS);
