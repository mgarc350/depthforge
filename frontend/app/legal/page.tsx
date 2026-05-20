import Link from 'next/link';

export default function LegalHubPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-fg mb-2">Legal</h1>
      <p className="text-muted mb-10">DepthForge's legal documents and open-source licensing information.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link href="/legal/terms" className="card hover:border-accent/40 transition-colors group">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-accent-dim flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-fg group-hover:text-accent transition-colors">Terms of Service</h2>
              <p className="text-sm text-muted mt-1">Usage rules, acceptable use, billing terms, and service limitations.</p>
            </div>
          </div>
        </Link>

        <Link href="/legal/privacy" className="card hover:border-accent/40 transition-colors group">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-accent-dim flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-fg group-hover:text-accent transition-colors">Privacy Policy</h2>
              <p className="text-sm text-muted mt-1">How we handle data, image deletion policy, GDPR and CCPA compliance.</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="card">
        <h2 className="font-semibold text-fg mb-3">Open-Source Licenses</h2>
        <div className="space-y-3">
          <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium text-fg">TripoSR</p>
              <p className="text-xs text-muted">Stability AI & Tripo AI — 3D generation model</p>
            </div>
            <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
              MIT
            </span>
          </div>
          <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium text-fg">rembg</p>
              <p className="text-xs text-muted">Background removal library</p>
            </div>
            <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
              MIT
            </span>
          </div>
          <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium text-fg">Three.js</p>
              <p className="text-xs text-muted">3D model viewer in browser</p>
            </div>
            <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
              MIT
            </span>
          </div>
          <div className="flex items-start justify-between py-3">
            <div>
              <p className="text-sm font-medium text-fg">DepthForge Platform</p>
              <p className="text-xs text-muted">This application</p>
            </div>
            <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
              MIT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
