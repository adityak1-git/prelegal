'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { NDAFormData } from '@/lib/nda-types';
import { mndaTermText, confidentialityTermText, STANDARD_TERMS, resolveTermBody } from '@/lib/nda-template';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
    paddingTop: 72,
    paddingBottom: 72,
    paddingLeft: 72,
    paddingRight: 72,
    lineHeight: 1.5,
  },
  title: {
    fontFamily: 'Times-Bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  sectionHeading: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#555',
    borderBottomWidth: 0.75,
    borderBottomColor: '#ccc',
    borderBottomStyle: 'solid',
    paddingBottom: 3,
    marginBottom: 10,
    marginTop: 16,
  },
  fieldLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: '#777',
    marginBottom: 1,
    marginTop: 6,
  },
  fieldValue: {
    fontSize: 10.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#bbb',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    minHeight: 14,
    color: '#111',
  },
  signaturesRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  signatureCol: {
    flex: 1,
    marginRight: 12,
  },
  partyLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    color: '#444',
  },
  signatureLine: {
    borderBottomWidth: 0.75,
    borderBottomColor: '#333',
    borderBottomStyle: 'solid',
    height: 20,
    marginBottom: 6,
  },
  divider: {
    borderTopWidth: 0.75,
    borderTopColor: '#bbb',
    borderTopStyle: 'solid',
    marginVertical: 16,
  },
  termParagraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  termTitle: {
    fontFamily: 'Times-Bold',
  },
  footer: {
    fontSize: 8,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 24,
  },
  italic: {
    fontFamily: 'Times-Italic',
    fontSize: 9,
    color: '#555',
    marginBottom: 8,
  },
});

function PdfField({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || '—'}</Text>
    </View>
  );
}

function PdfPartyCol({ label, name, title, company, address, date }: {
  label: string;
  name: string;
  title: string;
  company: string;
  address: string;
  date: string;
}) {
  return (
    <View style={styles.signatureCol}>
      <Text style={styles.partyLabel}>{label}</Text>
      <View style={styles.signatureLine} />
      <PdfField label="Print Name" value={name} />
      <PdfField label="Title" value={title} />
      <PdfField label="Company" value={company} />
      <PdfField label="Notice Address" value={address} />
      <PdfField label="Date" value={date} />
    </View>
  );
}

interface Props {
  data: NDAFormData;
}

export function NDAPdfDocument({ data }: Props) {
  return (
    <Document title="Mutual Non-Disclosure Agreement">
      {/* Cover Page */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Mutual Non-Disclosure Agreement</Text>
        <Text style={styles.subtitle}>Common Paper MNDA Standard Terms Version 1.0</Text>

        <Text style={styles.sectionHeading}>Cover Page</Text>
        <PdfField label="Purpose" value={data.purpose} />
        <PdfField label="Effective Date" value={data.effectiveDate} />
        <PdfField label="MNDA Term" value={mndaTermText(data)} />
        <PdfField label="Term of Confidentiality" value={confidentialityTermText(data)} />
        <PdfField label="Governing Law" value={data.governingLaw} />
        <PdfField label="Jurisdiction" value={data.jurisdiction} />
        {data.modifications ? (
          <PdfField label="MNDA Modifications" value={data.modifications} />
        ) : null}

        <Text style={styles.sectionHeading}>Signatures</Text>
        <Text style={styles.italic}>
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
        </Text>
        <View style={styles.signaturesRow}>
          <PdfPartyCol
            label="Party 1"
            name={data.party1Name}
            title={data.party1Title}
            company={data.party1Company}
            address={data.party1NoticeAddress}
            date={data.party1Date}
          />
          <PdfPartyCol
            label="Party 2"
            name={data.party2Name}
            title={data.party2Title}
            company={data.party2Company}
            address={data.party2NoticeAddress}
            date={data.party2Date}
          />
        </View>
      </Page>

      {/* Standard Terms */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Standard Terms</Text>
        <Text style={styles.subtitle}>Common Paper Mutual NDA Standard Terms Version 1.0</Text>

        {STANDARD_TERMS.map(term => (
          <Text key={term.number} style={styles.termParagraph}>
            <Text style={styles.termTitle}>{term.number}. {term.title}. </Text>
            <Text>{resolveTermBody(term, data)}</Text>
          </Text>
        ))}

        <Text style={styles.footer}>
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.
        </Text>
      </Page>
    </Document>
  );
}
