# ShareSaji 🍽️

**Viral Restaurant Discount Platform for Malaysian Local Restaurants**

ShareSaji is a web-based platform that helps restaurants boost foot traffic and sales through multi-level discount sharing. Customers earn rewards by referring others, creating a self-sustaining promotional ecosystem.

---

## 📋 Project Overview

### The Problem
Malaysian local restaurants struggle with:
- High customer acquisition costs
- One-time discounts that don't drive repeat visits
- Difficulty tracking promotion ROI
- Limited viral marketing mechanisms

### The Solution
ShareSaji creates a win-win-win system:
- **Customers:** Get 5% off first visit + earn unlimited virtual currency through referrals
- **Restaurants:** Pay for performance (discounts only on actual sales), measurable ROI
- **Viral Growth:** Multi-level rewards (up to 3 uplines) encourage aggressive sharing

### Key Features
- 🎟️ **Two-Tier Discounts:** 5% guaranteed + virtual currency redemption (up to 20% per bill)
- 🔗 **Multi-Level Referrals:** Earn 1% from up to 3 levels of downlines (unlimited downlines)
- 💰 **Virtual Currency Wallet:** Track earnings, redemptions, expiry dates
- 📊 **Analytics Dashboard:** Restaurant owners see real-time ROI
- 🔒 **Fraud Prevention:** Staff verification, receipt photos, expiry controls

---

## 🏗️ Project Structure

```
ShareSaji/
├── docs/                                    # Project documentation
│   ├── 01-product-requirements-document.md  # Comprehensive PRD
│   ├── 02-mvp-scope-moscow.md              # Feature prioritization (MoSCoW)
│   ├── 03-database-schema-design.md        # Database schema & ERD
│   ├── 04-technical-architecture.md        # System architecture & tech stack
│   ├── 05-api-specification.md             # REST API documentation
│   ├── 06-project-timeline-sprints.md      # Sprint planning & timeline
│   └── 07-user-stories-acceptance-criteria.md # User stories & acceptance criteria
├── src/                                     # Source code (to be created)
├── tests/                                   # Test files (to be created)
└── README.md                                # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier)
- SendGrid account (for emails)
- Git

### Installation (Coming Soon)
```bash
# Clone repository
git clone https://github.com/yourusername/ShareSaji.git
cd ShareSaji

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Supabase and SendGrid credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

---

## 📚 Documentation

### For Product Managers
- **[Product Requirements Document](docs/01-product-requirements-document.md)** - Complete product specification
- **[MVP Scope (MoSCoW)](docs/02-mvp-scope-moscow.md)** - Feature prioritization for MVP
- **[User Stories](docs/07-user-stories-acceptance-criteria.md)** - User stories with acceptance criteria

### For Developers
- **[Technical Architecture](docs/04-technical-architecture.md)** - System design & tech stack
- **[Database Schema](docs/03-database-schema-design.md)** - Database design & ERD
- **[API Specification](docs/05-api-specification.md)** - REST API endpoints

### For Project Managers
- **[Project Timeline](docs/06-project-timeline-sprints.md)** - Sprint planning & schedule
- **[User Stories](docs/07-user-stories-acceptance-criteria.md)** - Backlog & story points

---

## 🛠️ Technology Stack

### Frontend
- **React 18+** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **react-qr-code** - QR generation
- **html5-qrcode** - QR scanning

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL 15 (database)
  - Supabase Auth (authentication)
  - Supabase Storage (receipt photos)
  - Edge Functions (cron jobs)
- **SendGrid** - Email service

### Infrastructure
- **Vercel** - Frontend hosting
- **Supabase** - Backend hosting
- **GitHub Actions** - CI/CD

---

## 📊 MVP Scope

### Must Have (MVP Phase 1)
✅ Customer registration with referral tracking  
✅ Virtual currency wallet  
✅ Staff checkout with QR scanning  
✅ Manual transaction entry  
✅ Owner analytics dashboard  
✅ Email notifications  
✅ Multi-level rewards (3 uplines, unlimited downlines)  

### Won't Have (Phase 2+)
❌ AI OCR for receipts (manual entry for MVP)  
❌ Cross-restaurant functionality (single restaurant pilot)  
❌ Restaurant item database (transaction amount only)  
❌ Advanced gamification (badges, leaderboards)  

See [MVP Scope Document](docs/02-mvp-scope-moscow.md) for complete breakdown.

---

## 📅 Timeline

**Total Duration:** 3-4 weeks (2 developers)

- **Week 1:** Foundation & Setup (auth, registration, referrals)
- **Week 2:** Core Transactions (checkout, wallet, rewards)
- **Week 3:** Analytics & Polish (owner dashboard, emails, UI)
- **Week 4:** Launch Preparation (UAT, training, deployment)

See [Project Timeline](docs/06-project-timeline-sprints.md) for detailed sprint plan.

---

## 💰 Business Model

### Revenue Model
ShareSaji is **free for restaurants** (no subscription fees). Revenue comes from:
1. **Premium Features** (Phase 2+): Advanced analytics, custom branding
2. **Transaction Fees** (Phase 3+): Small fee per transaction (e.g., 0.5%)
3. **Cross-Restaurant Network** (Phase 3+): Restaurants pay to join network

### Cost Structure (Per Transaction)
- **Spender's First Use:** 5% guaranteed + 3% upline rewards = **8% total cost**
- **Spender's Subsequent Uses:** 0% guaranteed + 3% upline rewards + up to 20% redeemed = **variable cost**

### ROI for Restaurants
- **Target:** 3:1 revenue increase vs discount costs
- **Example:** RM100 in discounts → RM300 in new revenue
- **Mechanism:** Increased foot traffic, repeat visits, word-of-mouth

---

## 🔒 Security & Compliance

### Data Protection
- **Encryption:** HTTPS (TLS 1.2+) for all traffic, AES-256 at rest
- **Authentication:** JWT tokens, bcrypt password hashing
- **Authorization:** Row-Level Security (RLS) in Supabase

### PDPA Compliance
- Privacy Policy published
- User consent required on registration
- Data export/deletion available on request
- Email verification for anti-spam

### Fraud Prevention
- Staff verification at checkout (prevents fake transactions)
- Receipt photo upload (audit trail)
- 30-day expiry on virtual currency (limits liability)
- 20% redemption cap per transaction

---

## 🧪 Testing Strategy

### Manual Testing
- All user flows tested end-to-end
- Responsive design verified on iOS Safari, Android Chrome, desktop
- QR scanning tested on multiple devices

### Automated Testing
- Unit tests for utility functions (80% coverage target)
- Integration tests for API calls
- CI/CD pipeline with GitHub Actions

### User Acceptance Testing (UAT)
- 5-10 beta testers (friends, family)
- Guided testing sessions
- Feedback collection and prioritization

---

## 📈 Success Metrics

### MVP Success Criteria (First 4 Weeks)
- ✅ 100+ customer registrations
- ✅ 50%+ of users share their code
- ✅ Average 2+ downlines per user
- ✅ 30%+ redemption rate (virtual currency used before expiry)
- ✅ Positive ROI for restaurant (20%+ revenue increase vs discount costs)

### Long-Term KPIs (6 Months)
- 1,000+ registered customers across 5+ restaurants
- Virality coefficient >1.5 (self-sustaining growth)
- Customer lifetime value 3x vs non-program customers
- 80%+ restaurant satisfaction

---

## 🗺️ Roadmap

### Phase 1: MVP (Weeks 1-4) - **Current**
- Single restaurant pilot
- Manual transaction entry
- Basic analytics
- Email notifications

### Phase 2: Automation & Scale (Weeks 5-10)
- AI OCR for receipt processing
- Cross-restaurant code sharing
- Restaurant item database
- Advanced analytics (CSV export, date range)
- Social media share buttons

### Phase 3: Optimization (Weeks 11-16)
- Birthday offers automation
- Personalized recommendations
- Gamification (badges, leaderboards)
- Parameter configuration UI for owners
- Push notifications (PWA)

### Phase 4: Growth (Months 5-6)
- Multi-language support (Bahasa Malaysia)
- Restaurant discovery map
- Nutritional tracking
- Loyalty tiers (VIP program)
- Referral contests

---

## 🤝 Contributing

This is currently a private project for MVP development. Contributions will be opened after Phase 1 launch.

### Development Workflow
1. Create feature branch from `develop`
2. Implement feature with tests
3. Create pull request to `develop`
4. Code review by team lead
5. Merge after approval and passing tests
6. Deploy to staging for QA
7. Merge `develop` to `main` for production

---

## 📞 Support

### For Customers
- **Email:** support@sharesaji.com
- **FAQ:** [In-app FAQ page]

### For Restaurant Owners
- **Email:** partners@sharesaji.com
- **Phone:** +60 12-345-6789 (business hours)

### For Developers
- **GitHub Issues:** [Link to issues]
- **Documentation:** See `/docs` folder

---

## 📄 License

Copyright © 2025 ShareSaji. All rights reserved.

This project is proprietary software. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🙏 Acknowledgments

- **Supabase** - For excellent BaaS platform
- **Vercel** - For seamless frontend hosting
- **SendGrid** - For reliable email delivery
- **React Community** - For amazing open-source libraries

---

## 📝 Changelog

### Version 0.1.0 (2025-09-30)
- Initial project setup
- Documentation created (PRD, technical specs, timeline)
- Database schema designed
- Ready for development kickoff

---

**Built with ❤️ for Malaysian local restaurants**

*Helping restaurants grow through viral, community-driven promotions*
