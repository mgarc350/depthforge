'use client';

import Link from 'next/link';

interface Props {
  accepted: { terms: boolean; privacy: boolean };
  onChange: (accepted: { terms: boolean; privacy: boolean }) => void;
}

export default function LegalCheckboxes({ accepted, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Required Agreements</p>

      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => onChange({ ...accepted, terms: !accepted.terms })}
          className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all
            ${accepted.terms ? 'bg-accent border-accent' : 'border-border bg-surface-2 group-hover:border-accent/50'}`}
        >
          {accepted.terms && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="text-sm text-muted leading-snug">
          I have read and agree to the{' '}
          <Link href="/legal/terms" target="_blank" className="text-accent hover:underline" onClick={(e) => e.stopPropagation()}>
            Terms of Service
          </Link>
          {' '}and understand the acceptable use policy.
        </span>
      </label>

      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => onChange({ ...accepted, privacy: !accepted.privacy })}
          className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all
            ${accepted.privacy ? 'bg-accent border-accent' : 'border-border bg-surface-2 group-hover:border-accent/50'}`}
        >
          {accepted.privacy && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="text-sm text-muted leading-snug">
          I acknowledge the{' '}
          <Link href="/legal/privacy" target="_blank" className="text-accent hover:underline" onClick={(e) => e.stopPropagation()}>
            Privacy Policy
          </Link>
          {' '}and consent to image processing. My images will be deleted immediately after generation.
        </span>
      </label>

      {(!accepted.terms || !accepted.privacy) && (
        <p className="text-xs text-yellow-500/80 flex items-center gap-1.5 mt-1">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Both agreements required to generate
        </p>
      )}
    </div>
  );
}
