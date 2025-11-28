export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last Updated: October 27, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-foreground leading-relaxed">
              By accessing or using MalaChilli ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li><strong>"Platform":</strong> The MalaChilli web application and services</li>
              <li><strong>"User":</strong> Any person who creates an account (Customer, Staff, or Merchant)</li>
              <li><strong>"Virtual Currency" (VC):</strong> Reward credits earned through referrals, redeemable for discounts</li>
              <li><strong>"Referral Code":</strong> Unique code assigned to each user for sharing</li>
              <li><strong>"Restaurant Partner":</strong> Participating restaurants offering discounts through the Platform</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Account Registration</h2>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">3.1 Eligibility</h3>
            <p className="text-foreground leading-relaxed">
              You must be at least 18 years old to create an account. By registering, you represent that you meet this age requirement.
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">3.2 Account Responsibility</h3>
            <p className="text-foreground leading-relaxed">You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Providing accurate and complete information</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">3.3 One Account Per Person</h3>
            <p className="text-foreground leading-relaxed">
              Each person may only create one account. Multiple accounts created by the same person may be suspended or terminated.
            </p>
          </section>

          {/* Virtual Currency */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Virtual Currency Rules</h2>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">4.1 Earning Virtual Currency</h3>
            <p className="text-foreground leading-relaxed">You earn Virtual Currency when:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Your direct referrals (Level 1) make purchases (1% of bill amount)</li>
              <li>Your Level 2 referrals make purchases (1% of bill amount)</li>
              <li>Your Level 3 referrals make purchases (1% of bill amount)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">4.2 Redeeming Virtual Currency</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>VC can be redeemed at participating restaurants</li>
              <li>Maximum redemption: 20% of bill amount per transaction</li>
              <li>VC cannot be transferred to other users</li>
              <li>VC cannot be exchanged for cash</li>
              <li>VC has no monetary value outside the Platform</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">4.3 Expiry</h3>
            <p className="text-foreground leading-relaxed">
              Virtual Currency expires 30 days after earning. You will receive email notifications 7 days before expiry. Expired VC cannot be recovered.
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">4.4 No Guarantee</h3>
            <p className="text-foreground leading-relaxed">
              We do not guarantee that you will earn any specific amount of Virtual Currency. Earnings depend on your referrals' activities.
            </p>
          </section>

          {/* Referral Program */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Referral Program</h2>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">5.1 Sharing Your Code</h3>
            <p className="text-foreground leading-relaxed">You may share your referral code through:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Social media (WhatsApp, Facebook, Instagram)</li>
              <li>Direct messaging</li>
              <li>QR code display</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">5.2 Prohibited Activities</h3>
            <p className="text-foreground leading-relaxed">You may NOT:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Use spam or unsolicited messages to promote your code</li>
              <li>Create fake accounts to refer yourself</li>
              <li>Manipulate the referral system through fraudulent means</li>
              <li>Misrepresent the Platform or its benefits</li>
              <li>Use automated bots or scripts to generate referrals</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">5.3 Consequences</h3>
            <p className="text-foreground leading-relaxed">
              Violation of referral rules may result in account suspension, VC forfeiture, and permanent ban from the Platform.
            </p>
          </section>

          {/* Discounts and Transactions */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Discounts and Transactions</h2>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">6.1 Guaranteed Discount</h3>
            <p className="text-foreground leading-relaxed">
              First-time visitors to a restaurant receive a guaranteed discount (percentage set by restaurant). This discount is applied automatically at checkout.
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">6.2 Discount Limitations</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Discounts cannot be combined with other promotions unless specified</li>
              <li>Discounts apply to food and beverage only (not tax or service charge)</li>
              <li>Restaurant partners may exclude certain items from discounts</li>
              <li>Minimum bill amount may be required</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">6.3 Transaction Verification</h3>
            <p className="text-foreground leading-relaxed">
              Staff may request to see your QR code or referral code at checkout. You must present valid identification if requested.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Intellectual Property</h2>
            <p className="text-foreground leading-relaxed">
              All content, trademarks, logos, and intellectual property on the Platform are owned by MalaChilli or our licensors. You may not copy, modify, distribute, or create derivative works without written permission.
            </p>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. User Conduct</h2>
            <p className="text-foreground leading-relaxed">You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Violate any laws or regulations</li>
              <li>Infringe on others' rights</li>
              <li>Transmit viruses or malicious code</li>
              <li>Attempt to gain unauthorized access to the Platform</li>
              <li>Interfere with other users' experience</li>
              <li>Scrape or harvest data from the Platform</li>
              <li>Reverse engineer or decompile the Platform</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Termination</h2>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">9.1 By You</h3>
            <p className="text-foreground leading-relaxed">
              You may delete your account at any time through account settings or by contacting support. Upon deletion, your Virtual Currency balance will be forfeited.
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-2 mt-3">9.2 By Us</h3>
            <p className="text-foreground leading-relaxed">
              We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or for any reason at our discretion. We will provide notice when possible.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Disclaimers</h2>
            <p className="text-foreground leading-relaxed">
              THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy of information</li>
              <li>That defects will be corrected</li>
              <li>That the Platform is free from viruses</li>
              <li>Specific results from using the Platform</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">11. Limitation of Liability</h2>
            <p className="text-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MALACHILLI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR VIRTUAL CURRENCY.
            </p>
            <p className="text-foreground leading-relaxed mt-3">
              Our total liability shall not exceed RM 100 or the amount you paid to us in the past 12 months, whichever is greater.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">12. Indemnification</h2>
            <p className="text-foreground leading-relaxed">
              You agree to indemnify and hold harmless MalaChilli, its affiliates, and restaurant partners from any claims, damages, or expenses arising from your use of the Platform or violation of these Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">13. Governing Law</h2>
            <p className="text-foreground leading-relaxed">
              These Terms are governed by the laws of Malaysia. Any disputes shall be resolved in the courts of Malaysia.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">14. Changes to Terms</h2>
            <p className="text-foreground leading-relaxed">
              We may modify these Terms at any time. We will notify you of significant changes via email or prominent notice. Your continued use after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">15. Contact Us</h2>
            <p className="text-foreground leading-relaxed">
              If you have questions about these Terms, contact us at:
            </p>
            <div className="mt-3 text-foreground">
              <p><strong>Email:</strong> support@malachilli.com</p>
              <p><strong>Address:</strong> [Your Business Address]</p>
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
