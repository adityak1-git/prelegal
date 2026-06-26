import { notFound } from 'next/navigation';
import { ALL_DOC_TYPES, DOC_CONFIGS } from '@/lib/doc-configs';
import { NDACreator } from '@/components/NDACreator';
import { DocumentCreator } from '@/components/DocumentCreator';
import { HeaderNav } from '@/components/HeaderNav';

interface Props {
  params: Promise<{ docType: string }>;
}

export function generateStaticParams() {
  return ALL_DOC_TYPES.map(docType => ({ docType }));
}

export default async function CreatePage({ params }: Props) {
  const { docType } = await params;
  const config = DOC_CONFIGS[docType];
  if (!config) notFound();

  return (
    <div className="flex flex-col h-screen bg-white">
      <HeaderNav pageTitle={config.name} />

      {docType === 'mutual-nda' ? (
        <NDACreator />
      ) : (
        <DocumentCreator docType={docType} />
      )}
    </div>
  );
}
