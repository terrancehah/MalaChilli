# MalaChilli Documentation Index

**Last Updated:** 2025-10-10  
**Status:** Reorganized & Consolidated

## Complete Project Documentation Navigator

**Last Updated:** 2025-10-10  
**Project Status:** Documentation Reorganized, Ready for Development

---

## Recent Updates

### Rebranding (2025-10-10)
**Project renamed from ShareSaji to MalaChilli**
- ✅ All documentation updated (11 docs)
- ✅ All code files updated (frontend, backend, migrations)
- ✅ Malaysian green food design system implemented
- ✅ Brand colors: Forest Green (#0A5F0A), Lime Green (#7CB342)
- ✅ Directory renamed to `/MalaChilli`

### Documentation Reorganization (2025-10-10)

**Changes Made:**
- ✅ Created `09-frontend-development-guide.md` - All frontend/UI content consolidated
- ✅ Updated `01-product-requirements-document.md` - Added final discount model decision
- ✅ Updated `03-database-schema-design.md` - Added schema validation conclusions
- ✅ Updated `04-technical-architecture.md` - Frontend section redirects to doc 09
- ❌ Deleted `10-schema-design-analysis.md` - Consolidated into doc 03
- ❌ Deleted `11-guaranteed-discount-scenarios-analysis.md` - Consolidated into doc 01
- ❌ Deleted `12-final-discount-model-decision.md` - Consolidated into doc 01

**Result:** 9 core documents (down from 12), better organized by concern

---

## Quick Start by Role

### For Stakeholders & Investors
**Start here:** [Executive Summary](00-executive-summary.md)  
**Then read:** [Product Requirements Document](01-product-requirements-document.md)

### For Product Managers
**Start here:** [Product Requirements Document](01-product-requirements-document.md)  
**Then read:** [MVP Scope (MoSCoW)](02-mvp-scope-moscow.md), [User Stories](07-user-stories-acceptance-criteria.md)

### For Frontend Developers
**Start here:** [Frontend Development Guide](09-frontend-development-guide.md)  
**Then read:** [API Specification](05-api-specification.md), [Referral Implementation](08-referral-sharing-implementation-guide.md)

### For Backend Developers
**Start here:** [Technical Architecture](04-technical-architecture.md)  
**Then read:** [Database Schema](03-database-schema-design.md), [API Specification](05-api-specification.md)

### For Project Managers
**Start here:** [Project Timeline](06-project-timeline-sprints.md)  
**Then read:** [User Stories](07-user-stories-acceptance-criteria.md)

### For Restaurant Owners (Pilot Partner)
**Start here:** [Executive Summary](00-executive-summary.md)  
**Then read:** [Product Requirements Document](01-product-requirements-document.md) (Section 14.1: Final Discount Model)

---

## Complete Documentation List

{{ ... }}
### 1. Executive Summary
**File:** [00-executive-summary.md](00-executive-summary.md)  
**Audience:** Stakeholders, Investors, Restaurant Partners  
**Length:** ~30 pages  
**Purpose:** High-level project overview, business case, market opportunity

**Key Sections:**
- Project vision and problem statement
- Solution overview and how it works
- Market opportunity and competitive landscape
- Business model and revenue projections
- Go-to-market strategy
- Financial projections and ROI
- Risk analysis
- Investment ask (optional)

**When to Read:** Before committing to the project, for pitch presentations

---

### 2. Product Requirements Document (PRD)
**File:** [01-product-requirements-document.md](01-product-requirements-document.md)  
**Audience:** Product Managers, Developers, Stakeholders  
**Length:** ~50 pages  
**Purpose:** Complete product specification with features, user flows, and requirements

**Key Sections:**
- Executive summary and objectives
- Target users (customers, staff, owners)
- Core features (customer portal, staff portal, owner portal)
- Discount and rewards mechanism (detailed)
- Cross-restaurant functionality
- Fraud prevention and risk mitigation
- User flows (customer, staff, owner)
- Data requirements
- Technical requirements
- MVP scope and phasing
- Success criteria and KPIs

**When to Read:** Before starting design or development, for feature discussions

---

### 3. MVP Scope (MoSCoW Prioritization)
**File:** [02-mvp-scope-moscow.md](02-mvp-scope-moscow.md)  
**Audience:** Product Managers, Developers, Project Managers  
**Length:** ~25 pages  
**Purpose:** Feature prioritization for MVP using MoSCoW method

**Key Sections:**
- Must Have features (critical for MVP)
- Should Have features (important but can be delayed)
- Could Have features (nice to have, low priority)
- Won't Have features (explicitly excluded from MVP)
- MVP feature summary table
- Development priority order (Sprint 1-4)
- Success criteria for MVP
- Risk mitigation for scope creep
- Post-MVP roadmap preview

**When to Read:** Before sprint planning, when making scope decisions

---

### 4. Database Schema Design
**File:** [03-database-schema-design.md](03-database-schema-design.md)  
**Audience:** Backend Developers, Database Administrators, Technical Leads  
**Length:** ~40 pages  
**Purpose:** Complete database design with schema, ERD, and stored procedures

**Key Sections:**
- Schema overview and ERD
- Table definitions (users, restaurants, branches, referrals, transactions, virtual_currency_ledger)
- Views for common queries (wallet balance, downlines, analytics)
- Stored procedures (referral chain, upline rewards, redemption, expiry)
- Indexes and performance optimization
- Data integrity and constraints
- Sample data for testing
- Migration strategy
- Backup and recovery
- Security (Row-Level Security policies)

**When to Read:** Before database setup, during backend development

---

### 5. Technical Architecture
**File:** [04-technical-architecture.md](04-technical-architecture.md)  
**Audience:** Developers, DevOps Engineers, Technical Leads  
**Length:** ~45 pages  
**Purpose:** System design, tech stack, and infrastructure

**Key Sections:**
- Architecture overview (high-level diagram)
- Technology stack (frontend, backend, infrastructure)
- Frontend architecture (structure, routing, state management)
- Backend architecture (Supabase configuration, API endpoints)
- Data flow diagrams (registration, checkout, rewards)
- Security architecture (auth, encryption, RLS)
- Performance optimization
- Deployment architecture (environments, CI/CD)
- Scalability considerations
- Disaster recovery
- Third-party integrations (SendGrid, future OCR)
- Development workflow

**When to Read:** Before starting development, for architecture decisions

---

### 6. API Specification
**File:** [05-api-specification.md](05-api-specification.md)  
**Audience:** Frontend Developers, Backend Developers, QA Engineers  
**Length:** ~35 pages  
**Purpose:** Complete REST API documentation with endpoints and examples

**Key Sections:**
- Authentication endpoints (register, login, password recovery)
- User management endpoints (profile, referral code lookup)
- Referral management endpoints (create chain, get uplines/downlines)
- Virtual currency endpoints (wallet balance, transaction history, redemption)
- Transaction endpoints (create, list, distribute rewards)
- Restaurant management endpoints (details, branches, configuration)
- Analytics endpoints (summary, date range, top referrers)
- File storage endpoints (receipt photo upload)
- Cron jobs (expiry, notifications)
- Error responses and rate limiting
- Pagination, filtering, sorting

**When to Read:** During API integration, for frontend-backend coordination

---

### 7. Project Timeline & Sprint Planning
**File:** [06-project-timeline-sprints.md](06-project-timeline-sprints.md)  
**Audience:** Project Managers, Developers, Stakeholders  
**Length:** ~40 pages  
**Purpose:** Detailed sprint plan with tasks, timeline, and budget

**Key Sections:**
- Project milestones overview (4-week timeline)
- Detailed sprint breakdown (Sprint 1-4)
  - Sprint 1: Foundation (auth, registration, referrals)
  - Sprint 2: Core Transactions (checkout, wallet, rewards)
  - Sprint 3: Analytics & Polish (owner dashboard, emails, UI)
  - Sprint 4: Launch Preparation (UAT, training, deployment)
- Resource allocation (team structure, time commitment)
- Risk management (delays, mitigation)
- Daily standup format
- Weekly review and retrospective
- Success metrics (development and business)
- Post-MVP roadmap (Phase 2-4)
- Budget estimate (development, infrastructure, marketing)
- Gantt chart
- Checklist: Ready for launch
- Communication plan

**When to Read:** Before starting development, for sprint planning

---

### 8. User Stories & Acceptance Criteria
**File:** [07-user-stories-acceptance-criteria.md](07-user-stories-acceptance-criteria.md)  
**Audience:** Product Managers, Developers, QA Engineers  
**Length:** ~35 pages  
**Purpose:** Detailed user stories with acceptance criteria for all features

**Key Sections:**
- Customer portal stories (registration, wallet, referrals, redemption)
- Staff portal stories (checkout, discount application, transaction recording)
- Owner portal stories (analytics, reporting, management)
- System/technical stories (auth, referral logic, expiry)
- Non-functional stories (performance, security, compliance)
- Story point reference (Fibonacci scale)
- Acceptance testing checklist
- Definition of Done

**When to Read:** During sprint planning, for feature implementation

---

## 🗂️ Documentation by Phase

### Pre-Development Phase (Current)
1. ✅ [Executive Summary](00-executive-summary.md) - Business case
2. ✅ [Product Requirements Document](01-product-requirements-document.md) - What to build
3. ✅ [MVP Scope (MoSCoW)](02-mvp-scope-moscow.md) - What to prioritize
4. ✅ [Database Schema Design](03-database-schema-design.md) - Data structure
5. ✅ [Technical Architecture](04-technical-architecture.md) - How to build
6. ✅ [API Specification](05-api-specification.md) - API contracts
7. ✅ [Project Timeline](06-project-timeline-sprints.md) - When to build
8. ✅ [User Stories](07-user-stories-acceptance-criteria.md) - Detailed requirements
9. ✅ [Referral Sharing Implementation Guide](09-referral-sharing-implementation-guide.md) - Code/QR sharing flow

### Development Phase (Weeks 1-3)
- Refer to: [Project Timeline](06-project-timeline-sprints.md) for sprint tasks
- Refer to: [User Stories](07-user-stories-acceptance-criteria.md) for acceptance criteria
- Refer to: [Technical Architecture](04-technical-architecture.md) for implementation details
- Refer to: [API Specification](05-api-specification.md) for API integration

### Launch Phase (Week 4)
- Refer to: [Project Timeline](06-project-timeline-sprints.md) for Sprint 4 details

### Post-Launch Phase (Weeks 5-8)
- Refer to: [MVP Scope (MoSCoW)](02-mvp-scope-moscow.md) for Phase 2 roadmap

---

## 📊 Documentation Statistics

**Total Pages:** ~330 pages  
**Total Documents:** 9 documents  
**Total Sections:** 150+ sections  
**Total User Stories:** 40+ stories  
**Total API Endpoints:** 30+ endpoints  
**Total Database Tables:** 6 tables  
**Total Stored Procedures:** 4 procedures

**Time to Read All Docs:** ~8-10 hours  
**Time to Read Essential Docs (PRD, Architecture, Timeline):** ~3-4 hours

---

## 🔍 Quick Reference Guides

### Common Questions & Where to Find Answers

**Q: What is MalaChilli?**  
A: See [Executive Summary](00-executive-summary.md) - Section 1 & 2

**Q: How does the referral system work?**  
A: See [Product Requirements Document](01-product-requirements-document.md) - Section 4

**Q: What features are in the MVP?**  
A: See [MVP Scope (MoSCoW)](02-mvp-scope-moscow.md) - Section "Must Have"

**Q: What's the database structure?**  
A: See [Database Schema Design](03-database-schema-design.md) - Section 2

**Q: What technology stack are we using?**  
A: See [Technical Architecture](04-technical-architecture.md) - Section 1.2

**Q: What are the API endpoints?**  
A: See [API Specification](05-api-specification.md) - All sections

**Q: How long will development take?**  
A: See [Project Timeline](06-project-timeline-sprints.md) - Section 1 (3-4 weeks)

**Q: What do I need to do next?**  
A: See [Project Timeline](06-project-timeline-sprints.md) - Sprint 1 tasks

**Q: How do I test a feature?**  
A: See [User Stories](07-user-stories-acceptance-criteria.md) - Find the story, check acceptance criteria

**Q: What's the budget for MVP?**  
A: See [Project Timeline](06-project-timeline-sprints.md) - Section 9 (RM21,000-43,000)

---

## 📝 Document Version History

| Document | Version | Last Updated | Status |
|----------|---------|--------------|--------|
| Executive Summary | 1.0 | 2025-09-30 | Final |
| Product Requirements Document | 1.0 | 2025-09-30 | Final |
| MVP Scope (MoSCoW) | 1.0 | 2025-09-30 | Final |
| Database Schema Design | 1.0 | 2025-09-30 | Final |
| Technical Architecture | 1.0 | 2025-09-30 | Final |
| API Specification | 1.0 | 2025-09-30 | Final |
| Project Timeline | 1.0 | 2025-09-30 | Final |
| User Stories | 1.0 | 2025-09-30 | Final |
| Next Steps Checklist | 1.0 | 2025-09-30 | Final |

---

## 🎯 Recommended Reading Order

### For First-Time Readers (Complete Overview)
1. [Executive Summary](00-executive-summary.md) - 1 hour
2. [Product Requirements Document](01-product-requirements-document.md) - 2 hours
3. [MVP Scope (MoSCoW)](02-mvp-scope-moscow.md) - 1 hour
4. [Technical Architecture](04-technical-architecture.md) - 1.5 hours
5. [Project Timeline](06-project-timeline-sprints.md) - 1.5 hours

**Total Time: ~7 hours**

### For Quick Start (Essential Only)
1. [Executive Summary](00-executive-summary.md) - Sections 1-5 (30 min)
2. [MVP Scope (MoSCoW)](02-mvp-scope-moscow.md) - "Must Have" section (30 min)
3. [Project Timeline](06-project-timeline-sprints.md) - Sprint overview (30 min)

**Total Time: ~1.5 hours**

### For Developers (Technical Focus)
1. [Technical Architecture](04-technical-architecture.md) - All sections (1.5 hours)
2. [Database Schema Design](03-database-schema-design.md) - All sections (1.5 hours)
3. [API Specification](05-api-specification.md) - All sections (1 hour)
4. [User Stories](07-user-stories-acceptance-criteria.md) - Technical stories (1 hour)

**Total Time: ~5 hours**

---

## 🔗 External Resources

### Technology Documentation
- **React:** https://react.dev/
- **Supabase:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vercel:** https://vercel.com/docs
- **SendGrid:** https://docs.sendgrid.com/

### Project Management
- **GitHub:** https://github.com/yourusername/MalaChilli (to be created)
- **Slack/WhatsApp:** Team communication channel (to be setup)

---

## 📞 Contact & Support

**For Documentation Questions:**
- **Email:** docs@sharesaji.com
- **Slack:** #documentation channel

**For Technical Questions:**
- **Technical Lead:** [Name] - [Email]
- **Slack:** #dev-help channel

**For Project Management Questions:**
- **Project Manager:** [Name] - [Email]
- **Slack:** #project-management channel

---

## ✅ Documentation Review Checklist

Before starting development, ensure:
- [ ] All stakeholders have reviewed relevant documents
- [ ] All questions and concerns addressed
- [ ] All documents approved and signed off
- [ ] All team members have access to documentation
- [ ] All team members understand their roles and responsibilities

---

**Ready to build MalaChilli? Start with [Project Timeline](06-project-timeline-sprints.md)!** 🚀

---

*This documentation was created on 2025-09-30 and represents the complete project specification for MalaChilli MVP. All documents are living documents and may be updated as the project evolves.*
