import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/legal" className="text-sm text-muted hover:text-accent transition-colors mb-6 inline-flex items-center gap-1">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Legal
      </Link>

      <h1 className="text-3xl font-bold text-fg mb-2">Privacy Policy</h1>
      <p className="text-muted text-sm mb-2">Last updated: January 1, 2025</p>
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-10">
        <p className="text-green-400 text-sm font-medium">
          Images you upload are permanently deleted immediately after your 3D model is generated. We never store, sell, or analyze your images.
        </p>
      </div>

      <div className="space-y-8 text-fg/90">
        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">1. Introduction</h2>
          <p className="text-muted leading-relaxed">
            DepthForge ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you use our Service. This policy
            complies with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">2. Information We Collect</h2>
          <h3 className="text-base font-medium text-fg mb-2">2.1 Account Information</h3>
          <p className="text-muted leading-relaxed mb-3">
            When you create an account via Clerk, we receive your email address, name, and profile information.
            This is stored in Supabase and is used to identify you and provide the Service.
          </p>
          <h3 className="text-base font-medium text-fg mb-2">2.2 Images (Temporary Processing Only)</h3>
          <p className="text-muted leading-relaxed mb-3">
            Images you upload are transmitted directly to our GPU processing servers (RunPod) for 3D model
            generation. <strong className="text-fg">Images are permanently deleted from all servers immediately
            after generation completes or fails.</strong> Images are never stored in our database, never backed up,
            and never accessible after the generation task ends.
          </p>
          <h3 className="text-base font-medium text-fg mb-2">2.3 Generated Models</h3>
          <p className="text-muted leading-relaxed mb-3">
            3D models you generate are stored in Supabase Storage and associated with your account. You can delete
            your models at any time from the My Models page.
          </p>
          <h3 className="text-base font-medium text-fg mb-2">2.4 Usage Data</h3>
          <p className="text-muted leading-relaxed">
            We collect information about how you use the Service, including generation history, settings used,
            and credit usage. This helps us improve the Service and is stored in Supabase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li>To provide and operate the 3D generation service</li>
            <li>To manage your account and credit balance</li>
            <li>To process payments via Stripe</li>
            <li>To send transactional emails (purchase confirmations, generation complete notifications)</li>
            <li>To comply with legal obligations</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">4. Data Sharing</h2>
          <p className="text-muted leading-relaxed mb-3">We share your information only with:</p>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li><strong className="text-fg">Clerk</strong> — Authentication provider. See Clerk's privacy policy.</li>
            <li><strong className="text-fg">Supabase</strong> — Database and file storage. Data is encrypted at rest.</li>
            <li><strong className="text-fg">Stripe</strong> — Payment processing. We never see full card numbers.</li>
            <li><strong className="text-fg">RunPod</strong> — GPU processing for 3D generation. Images are deleted immediately after use.</li>
          </ul>
          <p className="text-muted leading-relaxed mt-3">
            We do not sell, rent, or share your personal information with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">5. Image Deletion Policy</h2>
          <p className="text-muted leading-relaxed">
            We take image privacy seriously. Our technical implementation ensures:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted mt-2">
            <li>Images are held only in volatile memory during processing — never written to permanent storage</li>
            <li>Temporary files are securely deleted upon job completion or failure using OS-level secure deletion</li>
            <li>No image data persists beyond the lifetime of a single generation job</li>
            <li>Our servers are not configured to log image content or metadata</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">6. GDPR Rights (EU Residents)</h2>
          <p className="text-muted leading-relaxed mb-3">
            If you are located in the European Economic Area, you have the following rights:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li><strong className="text-fg">Access</strong> — Request a copy of your personal data</li>
            <li><strong className="text-fg">Rectification</strong> — Correct inaccurate data</li>
            <li><strong className="text-fg">Erasure</strong> — Request deletion of your data ("right to be forgotten")</li>
            <li><strong className="text-fg">Portability</strong> — Receive your data in a machine-readable format</li>
            <li><strong className="text-fg">Objection</strong> — Object to certain processing activities</li>
            <li><strong className="text-fg">Restriction</strong> — Request limited processing of your data</li>
          </ul>
          <p className="text-muted leading-relaxed mt-3">
            To exercise these rights, email <a href="mailto:privacy@depthforge.ai" className="text-accent hover:underline">privacy@depthforge.ai</a>.
            We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">7. CCPA Rights (California Residents)</h2>
          <p className="text-muted leading-relaxed mb-3">
            Under the California Consumer Privacy Act, California residents have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li>Know what personal information is collected about you</li>
            <li>Know whether your personal information is sold or disclosed and to whom</li>
            <li>Opt out of the sale of personal information (we do not sell personal information)</li>
            <li>Request deletion of your personal information</li>
            <li>Not be discriminated against for exercising your CCPA rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">8. Data Security</h2>
          <p className="text-muted leading-relaxed">
            We implement industry-standard security measures including TLS encryption for data in transit,
            AES-256 encryption for data at rest in Supabase, and regular security audits. However, no method
            of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">9. Data Retention</h2>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li><strong className="text-fg">Images</strong>: Deleted immediately after generation (0 retention)</li>
            <li><strong className="text-fg">Generated 3D models</strong>: Retained until you delete them</li>
            <li><strong className="text-fg">Account data</strong>: Retained until account deletion</li>
            <li><strong className="text-fg">Payment records</strong>: Retained 7 years for tax/legal compliance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">10. Cookies</h2>
          <p className="text-muted leading-relaxed">
            We use only essential cookies required for authentication (provided by Clerk). We do not use
            advertising, tracking, or analytics cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">11. Children's Privacy</h2>
          <p className="text-muted leading-relaxed">
            The Service is not directed to children under 13. We do not knowingly collect personal information
            from children under 13. If you believe a child has provided us with personal information, contact us
            immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">12. Contact</h2>
          <p className="text-muted leading-relaxed">
            For privacy inquiries, contact our Data Protection Officer at{' '}
            <a href="mailto:privacy@depthforge.ai" className="text-accent hover:underline">privacy@depthforge.ai</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
