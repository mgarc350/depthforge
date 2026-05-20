'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import CreditDisplay from './CreditDisplay';
import PricingModal from './PricingModal';

const NAV_LINKS = [
  { href: '/', label: 'Generate' },
  { href: '/models', label: 'My Models' },
  { href: '/animate', label: 'Animate' },
  { href: '/legal', label: 'Legal' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="font-bold text-lg text-fg tracking-tight">DepthForge</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-accent bg-accent-dim'
                      : 'text-muted hover:text-fg hover:bg-surface-2'
                  }`}
                >
                  {link.label}
                  {link.label === 'Animate' && (
                    <span className="ml-1.5 text-[10px] bg-accent text-white px-1 py-0.5 rounded font-bold">SOON</span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {isSignedIn ? (
                <>
                  <CreditDisplay onBuyClick={() => setPricingOpen(true)} />
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <SignInButton mode="modal">
                  <button className="btn-primary py-2 px-4 text-sm">Sign In</button>
                </SignInButton>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-muted hover:text-fg hover:bg-surface-2 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-border py-3 space-y-1 animate-fade-in">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-accent bg-accent-dim'
                      : 'text-muted hover:text-fg hover:bg-surface-2'
                  }`}
                >
                  {link.label}
                  {link.label === 'Animate' && (
                    <span className="text-[10px] bg-accent text-white px-1 py-0.5 rounded font-bold">SOON</span>
                  )}
                </Link>
              ))}
              <div className="pt-2 px-3">
                {isSignedIn ? (
                  <div className="flex items-center gap-3">
                    <CreditDisplay onBuyClick={() => { setMenuOpen(false); setPricingOpen(true); }} />
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button className="btn-primary w-full text-sm py-2.5">Sign In</button>
                  </SignInButton>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
    </>
  );
}
