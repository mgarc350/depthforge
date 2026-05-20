import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/legal" className="text-sm text-muted hover:text-accent transition-colors mb-6 inline-flex items-center gap-1">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Legal
      </Link>

      <h1 className="text-3xl font-bold text-fg mb-2">Terms of Service</h1>
      <p className="text-muted text-sm mb-10">Last updated: January 1, 2025</p>

      <div className="prose prose-invert max-w-none space-y-8 text-fg/90">
        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted leading-relaxed">
            By accessing or using DepthForge ("Service"), you agree to be bound by these Terms of Service. If you
            disagree with any part of the terms, you may not access the Service. These terms apply to all users,
            visitors, and others who access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">2. Description of Service</h2>
          <p className="text-muted leading-relaxed">
            DepthForge provides an AI-powered platform that converts images into 3D models using the TripoSR model
            (MIT licensed by Stability AI and Tripo AI). The Service enables users to upload images, generate 3D
            models, and export them in various formats including GLB, OBJ, FBX, STL, and BLEND.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">3. Accounts and Authentication</h2>
          <p className="text-muted leading-relaxed">
            You must create an account to use the Service. Authentication is provided by Clerk, Inc. You are
            responsible for maintaining the confidentiality of your account credentials. You agree to notify us
            immediately of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">4. Credits and Payments</h2>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li>Credits are required to generate 3D models. Credits do not expire.</li>
            <li>Credit packs are available: Starter (10 credits, $3), Pro (50 credits, $12), Studio (200 credits, $40).</li>
            <li>All payments are processed by Stripe. We do not store payment card information.</li>
            <li>Credit purchases are non-refundable once credits have been used.</li>
            <li>Unused credits may be refunded within 30 days of purchase at our discretion.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">5. Acceptable Use</h2>
          <p className="text-muted leading-relaxed mb-3">You agree not to use the Service to:</p>
          <ul className="list-disc list-inside space-y-2 text-muted">
            <li>Upload images depicting illegal content, including but not limited to CSAM.</li>
            <li>Infringe on intellectual property rights of others.</li>
            <li>Generate 3D models of real people without their consent.</li>
            <li>Attempt to reverse-engineer, scrape, or abuse the Service's APIs.</li>
            <li>Circumvent usage limits or billing mechanisms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">6. Intellectual Property</h2>
          <p className="text-muted leading-relaxed">
            You retain ownership of images you upload and 3D models you generate. By using the Service, you grant
            DepthForge a limited license to process your content solely for the purpose of providing the Service.
            We do not claim ownership of your content. Generated models are yours to use commercially or otherwise,
            subject to the TripoSR MIT license terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">7. Data and Privacy</h2>
          <p className="text-muted leading-relaxed">
            Images uploaded to DepthForge are deleted immediately after 3D model generation is complete. We do not
            retain or sell your uploaded images. For complete information about data handling, see our{' '}
            <Link href="/legal/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">8. Service Availability</h2>
          <p className="text-muted leading-relaxed">
            We strive for 99.9% uptime but do not guarantee uninterrupted access to the Service. Generation times
            may vary based on server load and model complexity. We reserve the right to modify, suspend, or
            discontinue the Service at any time with reasonable notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">9. Disclaimer of Warranties</h2>
          <p className="text-muted leading-relaxed">
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. DEPTHFORGE DOES NOT
            WARRANT THAT THE SERVICE WILL MEET YOUR REQUIREMENTS OR BE ERROR-FREE. USE OF THE SERVICE IS AT YOUR OWN RISK.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">10. Limitation of Liability</h2>
          <p className="text-muted leading-relaxed">
            IN NO EVENT SHALL DEPTHFORGE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE MONTHS
            PRECEDING THE CLAIM.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">11. Termination</h2>
          <p className="text-muted leading-relaxed">
            We reserve the right to terminate or suspend your account immediately if you violate these Terms.
            You may terminate your account at any time by contacting us. Upon termination, unused credits will
            be refunded at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">12. Changes to Terms</h2>
          <p className="text-muted leading-relaxed">
            We reserve the right to modify these terms at any time. We will provide notice of material changes
            via email or a prominent notice on the Service. Continued use of the Service after changes constitutes
            acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-fg mb-3">13. Contact</h2>
          <p className="text-muted leading-relaxed">
            For questions about these Terms, please contact us at{' '}
            <a href="mailto:legal@depthforge.ai" className="text-accent hover:underline">legal@depthforge.ai</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
