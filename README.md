# MalaChilli 🍽️

**Customer Engagement & Loyalty Platform**

MalaChilli is a web-based platform that helps restaurants increase customer engagement through a referral-based reward system. Customers can earn and redeem rewards while restaurants gain insights into their promotion effectiveness.

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
MalaChilli/
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



## 📄 License

Copyright © 2025 MalaChilli. All rights reserved.

This project is proprietary software. Unauthorized copying, distribution, or use is strictly prohibited.

---

**Built with ❤️ for Malaysian local restaurants**

*Helping restaurants grow through viral, community-driven promotions*
