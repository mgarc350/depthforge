'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import type { CreditPack } from '@/types';

const PACKS: CreditPack[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 10,
    price: 3,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || '',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 50,
    price: 12,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '',
    popular: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    credits: 200,
    price: 40,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDIO || '',
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PricingModal({ open, onClose }: Props) {
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  if (!open) return null;

  const handleBuy = async (pack: CreditPack) => {
    if (!user) return;
    setLoading(pack.id);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: pack.priceId, packId: pack.id }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-fg hover:bg-surface-2 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-fg mb-1">Buy Credits</h2>
        <p className="text-sm text-muted mb-6">Credits never expire. No subscription required.</p>

        <div className="space-y-3">
          {PACKS.map((pack) => (
            <button
              key={pack.id}
              onClick={() => handleBuy(pack)}
              disabled={loading !== null}
              className={`
                w-full flex items-center justify-between p-4 rounded-xl border transition-all group
                ${pack.popular
                  ? 'border-accent bg-accent-dim hover:bg-accent/20'
                  : 'border-border bg-surface-2 hover:border-accent/40'
                }
                disabled:opacity-50
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${pack.popular ? 'bg-accent' : 'bg-surface'}`}>
                  <svg className={`h-5 w-5 ${pack.popular ? 'text-white' : 'text-accent'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-fg">{pack.name}</span>
                    {pack.popular && (
                      <span className="text-[10px] bg-accent text-white px-1.5 py-0.5 rounded-full font-bold">POPULAR</span>
                    )}
                  </div>
                  <p className="text-sm text-muted">{pack.credits} credits</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-bold text-fg">${pack.price}</p>
                  <p className="text-xs text-muted">${(pack.price / pack.credits).toFixed(2)}/credit</p>
                </div>
                {loading === pack.id ? (
                  <div className="h-5 w-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                ) : (
                  <svg className="h-5 w-5 text-muted group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted text-center mt-5">
          Secured by Stripe · No card data stored · Cancel anytime
        </p>
      </div>
    </div>
  );
}
