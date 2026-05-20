'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getCredits } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin';

interface Props {
  onBuyClick: () => void;
}

export default function CreditDisplay({ onBuyClick }: Props) {
  const { user } = useUser();
  const [credits, setCredits] = useState<number | null>(null);

  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const admin = isAdmin(email);

  useEffect(() => {
    if (!user || admin) return;
    getCredits(user.id).then(setCredits);
  }, [user, admin]);

  // Admin view — clickable to open pricing modal for testing
  if (admin) {
    return (
      <button onClick={onBuyClick} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/50 bg-accent-dim text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <span>∞</span>
        <span className="hidden sm:inline font-bold tracking-wide text-xs">ADMIN</span>
      </button>
    );
  }

  // Loading skeleton
  if (credits === null) {
    return <div className="h-8 w-20 bg-surface-2 rounded-lg animate-pulse" />;
  }

  return (
    <button
      onClick={onBuyClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
        ${credits === 0
          ? 'border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20'
          : credits < 5
          ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
          : 'border-border bg-surface-2 text-fg hover:border-accent/50'
        }
      `}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span className="tabular-nums">{credits}</span>
      <span className="text-muted hidden sm:inline">credits</span>
      <svg className="h-3 w-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}
