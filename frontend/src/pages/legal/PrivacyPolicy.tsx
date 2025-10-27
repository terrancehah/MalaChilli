export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last Updated: October 27, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Introduction</h2>
            <p className="text-foreground leading-relaxed">
              MalaChilli ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our viral restaurant discount platform.
            </p>
            <p className="text-foreground leading-relaxed mt-2">
              This policy complies with the Personal Data Protection Act 2010 (PDPA) of Malaysia.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">2.1 Personal Information</h3>
            <p className="text-foreground leading-relaxed">We collect the following personal information:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Email address (for account creation and communication)</li>
              <li>Full name (for personalization)</li>
              <li>Birthday and age (for age verification and special offers)</li>
              <li>Password (encrypted and securely stored)</li>
              <li>Referral code (unique identifier for sharing)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">2.2 Transaction Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Purchase history (bill amounts, discounts applied)</li>
              <li>Virtual currency balance and transaction history</li>
              <li>Restaurant visit history</li>
              <li>Referral relationships (uplines and downlines)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">2.3 Technical Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage data (pages visited, time spent)</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <p className="text-foreground leading-relaxed">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Create and manage your account</li>
              <li>Process transactions and apply discounts</li>
              <li>Calculate and distribute referral rewards</li>
              <li>Send transaction confirmations and notifications</li>
              <li>Notify you about virtual currency expiry</li>
              <li>Improve our services and user experience</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Information Sharing</h2>
            <p className="text-foreground leading-relaxed">We share your information with:</p>
            
            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">4.1 Restaurant Partners</h3>
            <p className="text-foreground leading-relaxed">
              We share your name and transaction details with restaurants where you make purchases to facilitate discount redemption and service delivery.
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">4.2 Service Providers</h3>
            <p className="text-foreground leading-relaxed">
              We use third-party services for:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Authentication and database (Supabase)</li>
              <li>Email delivery (for notifications)</li>
              <li>Analytics (to improve our service)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">4.3 Legal Requirements</h3>
            <p className="text-foreground leading-relaxed">
              We may disclose your information if required by law or to protect our rights and safety.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Data Security</h2>
            <p className="text-foreground leading-relaxed">We implement security measures including:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encryption of data at rest</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Your Rights (PDPA)</h2>
            <p className="text-foreground leading-relaxed">Under the PDPA, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              <li><strong>Complaint:</strong> Lodge a complaint with the Personal Data Protection Commissioner</li>
            </ul>
            <p className="text-foreground leading-relaxed mt-3">
              To exercise these rights, contact us at: <a href="mailto:privacy@malachilli.com" className="text-primary hover:underline">privacy@malachilli.com</a>
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Data Retention</h2>
            <p className="text-foreground leading-relaxed">
              We retain your personal data for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for legal compliance and fraud prevention purposes for up to 7 years.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Cookies and Tracking</h2>
            <p className="text-foreground leading-relaxed">
              We use essential cookies for authentication and session management. We do not use third-party advertising cookies. You can control cookies through your browser settings.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Children's Privacy</h2>
            <p className="text-foreground leading-relaxed">
              Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Changes to This Policy</h2>
            <p className="text-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email or prominent notice on our platform. Your continued use after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">11. Contact Us</h2>
            <p className="text-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, contact us at:
            </p>
            <div className="mt-3 text-foreground">
              <p><strong>Email:</strong> privacy@malachilli.com</p>
              <p><strong>Address:</strong> [Your Business Address]</p>
              <p><strong>Data Protection Officer:</strong> [DPO Name and Contact]</p>
            </div>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="text-primary hover:underline"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
