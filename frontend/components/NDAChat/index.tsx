'use client';

import { useState, useEffect, useRef } from 'react';
import { NDAFormData } from '@/lib/nda-types';
import { API_BASE } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface NDAFieldUpdates {
  [key: string]: string | null | undefined;
}

interface ChatResponse {
  message: string;
  field_updates: NDAFieldUpdates;
}

interface Props {
  onChange: (updates: Partial<NDAFormData>) => void;
}

export function NDAChat({ onChange }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function callChatAPI(msgs: Message[], currentFields: Record<string, string>) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_type: 'mutual-nda', messages: msgs, field_values: currentFields }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: ChatResponse = await res.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);

      const updates: Partial<NDAFormData> = {};
      for (const [key, value] of Object.entries(data.field_updates)) {
        if (value !== null && value !== undefined) {
          (updates as Record<string, unknown>)[key] = value;
        }
      }
      if (Object.keys(updates).length > 0) {
        setFieldValues(prev => ({ ...prev, ...updates as Record<string, string> }));
        onChange(updates);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    callChatAPI([], {}).then(() => inputRef.current?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    await callChatAPI(updatedMessages, fieldValues);
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="mb-4 shrink-0">
        <h2 className="text-lg font-semibold text-[#032147]">AI Legal Assistant</h2>
        <p className="text-sm text-[#888888]">Chat to create your Mutual NDA</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#209dd7] text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <span className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message…"
          disabled={loading}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#209dd7] focus:border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-[#753991] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#612d7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
