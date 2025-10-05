# ShareSaji 🍽️

**Customer Engagement & Loyalty Platform**

ShareSaji is a web-based platform that helps restaurants increase customer engagement through a referral-based reward system. Customers can earn and redeem rewards while restaurants gain insights into their promotion effectiveness.

---

## 📋 Project Overview

### Purpose
A digital solution for restaurants to manage customer loyalty programs with built-in viral mechanics and real-time analytics.

### Key Features
- 🎟️ **Discount Management:** Configurable discount system with multiple reward tiers
- 🔗 **Referral System:** Multi-level customer referral tracking
- 💰 **Digital Wallet:** Virtual currency management for customers
- 📊 **Analytics Dashboard:** Real-time insights for restaurant owners
- 🔒 **Security:** Transaction verification and fraud prevention mechanisms

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

## 💡 Core Concepts

### System Architecture
- **Customer Portal:** Registration, wallet management, referral tracking
- **Staff Portal:** Transaction processing, code verification, checkout interface
- **Owner Portal:** Analytics, reporting, configuration management

### Technical Approach
- Modern web technologies for responsive, cross-platform experience
- Real-time data synchronization for instant updates
- Scalable backend infrastructure with cloud services

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

### Technical Milestones
- ✅ All core features implemented and tested
- ✅ Responsive design across devices
- ✅ Secure authentication and authorization
- ✅ Real-time data synchronization
- ✅ Production deployment successful

### System Performance
- Page load time <3 seconds on 4G
- 99% uptime during business hours
- QR scanning <2 seconds
- Database queries optimized with proper indexing

---

## 🗺️ Roadmap

### Phase 1: MVP (Weeks 1-4) - **Current**
- Single restaurant pilot
- Manual transaction entry
- Basic analytics
- Email notifications

### Phase 2: Enhancement (Weeks 5-10)
- Automated receipt processing
- Multi-location support
- Enhanced analytics and reporting
- Advanced data export features
- Social media integration

### Phase 3: Optimization (Weeks 11-16)
- Automated event-based offers
- Personalized user experience
- Enhanced engagement features
- Advanced configuration interface
- Progressive Web App (PWA) capabilities

### Phase 4: Scale (Months 5-6)
- Multi-language support
- Location discovery features
- Extended data tracking
- Advanced user tiers
- Promotional campaigns

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

## 📞 Contact

### Technical Documentation
- **Documentation:** See `/docs` folder for comprehensive guides
- **API Specification:** `/docs/05-api-specification.md`
- **Architecture:** `/docs/04-technical-architecture.md`

### Project Information
- **Status:** In Development (MVP Phase)
- **Timeline:** 3-4 weeks estimated completion
- **Team:** 2-3 developers

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
