import { API_BASE } from './api';

export interface SavedDocument {
  id: number;
  doc_type: string;
  doc_name: string;
  filename: string;
  field_values: Record<string, string>;
  created_at: string;
}

export async function saveDocument(
  token: string,
  payload: {
    doc_type: string;
    doc_name: string;
    filename: string;
    field_values: Record<string, string>;
  },
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? 'Failed to save document');
  }
}

export async function listDocuments(token: string): Promise<SavedDocument[]> {
  const res = await fetch(`${API_BASE}/api/documents/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}
