import { NDACreator } from '@/components/NDACreator';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Prelegal</span>
          <span className="text-gray-300">›</span>
          <h1 className="text-sm font-semibold text-gray-900">Mutual NDA Creator</h1>
        </div>
        <span className="text-xs text-gray-400">Common Paper MNDA v1.0</span>
      </header>
      <NDACreator />
    </div>
  );
}
