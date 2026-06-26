'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from './AuthModal';
import { UserMenu } from './UserMenu';

interface Props {
  pageTitle?: string;
}

export function HeaderNav({ pageTitle }: Props) {
  const auth = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-400 uppercase tracking-wider hover:text-[#209dd7] transition-colors"
          >
            Prelegal
          </Link>
          {pageTitle && (
            <>
              <span className="text-gray-300">›</span>
              <span className="text-sm font-semibold text-gray-900">{pageTitle}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {auth.status === 'loading' && (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          )}
          {auth.status === 'unauthenticated' && (
            <div className="flex items-center gap-2">
              <Link
                href="/my-documents/"
                className="text-sm text-[#888888] hover:text-[#209dd7] transition-colors hidden sm:block"
              >
                My Documents
              </Link>
              <button
                onClick={() => setShowAuth(true)}
                className="rounded-xl border border-[#209dd7] px-4 py-1.5 text-sm font-medium text-[#209dd7] hover:bg-[#209dd7] hover:text-white transition-colors"
              >
                Sign in
              </button>
            </div>
          )}
          {auth.status === 'authenticated' && <UserMenu />}
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
