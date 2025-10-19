# MalaChilli 🍽️

**Full-Stack Restaurant Loyalty Platform** — React • TypeScript • Supabase • PostgreSQL

> **Portfolio Project:** Technical showcase demonstrating full-stack development, database design, and modern web architecture. Proprietary business logic excluded.

---

## 🛠️ Tech Stack

**Frontend:** React 18 • TypeScript • Tailwind CSS • shadcn/ui • Vite  
**Backend:** Supabase • PostgreSQL • Row-Level Security • Edge Functions  
**Tools:** ESLint • Prettier • Git • Vercel

---

## 💡 Key Technical Skills Demonstrated

### Full-Stack Development
- Type-safe React components with TypeScript
- Responsive mobile-first UI with Tailwind CSS
- Context API for global state management
- RESTful API integration with Supabase client

### Database & Backend
- Complex PostgreSQL schema design with relational integrity
- Row-Level Security (RLS) policies for data isolation
- JWT-based authentication with bcrypt password hashing
- Database views and stored procedures for business logic

### Modern Development Practices
- Component-driven development with shadcn/ui
- Git workflow with feature branches
- ESLint + Prettier for code quality
- Environment-based configuration management

---

## ✨ Core Features

**Authentication System** - JWT tokens, role-based access control, email verification  
**Customer Dashboard** - Restaurant-specific virtual currency tracking, referral management, QR codes  
**Social Sharing** - One-click WhatsApp/Facebook sharing with pre-filled messages  
**Transaction Processing** - QR scanning, receipt uploads, real-time calculations  
**Analytics** - Metrics dashboard with reporting and export capabilities

---

## 📱 Screenshots

### Total Virtual Currency Stats
Centralized stats card showing total earnings and savings across all restaurants, giving users a complete overview of their loyalty rewards throughout their app lifecycle.

<div align="center">
  <img src="docs/images/dashboard-total-stats.png" alt="Total Stats" width="300"/>
  <p><em>Total earned and redeemed VC across all restaurants</em></p>
</div>

### Restaurant-Specific Promotion Cards
Minimal restaurant cards displaying individual VC balance, visit tracking, and share functionality. Each restaurant maintains its own separate VC balance to prevent cross-restaurant exploitation. Currency earned at one restaurant can only be redeemed at that restaurant, ensuring fair distribution.

<div align="center">
  <img src="docs/images/dashboard-restaurant-cards.png" alt="Restaurant Cards" width="300"/>
  <p><em>Clean restaurant cards with minimal VC balance display</em></p>
</div>

### How It Works Modal
Information modal explaining the restaurant promotion mechanism and virtual currency earning system.

<div align="center">
  <img src="docs/images/dashboard-how-it-works.png" alt="How It Works" width="300"/>
  <p><em>User guide explaining earning and using virtual currency</em></p>
</div>

### Swipeable Share Bottom Sheet
Mobile-optimized bottom sheet with organized sharing options: referral link, social media buttons (WhatsApp, Facebook), and promotion code.

<div align="center">
  <img src="docs/images/dashboard-share-bottom-sheet.png" alt="Share Bottom Sheet" width="300"/>
  <p><em>Native-feeling swipeable bottom sheet with all sharing options</em></p>
</div>

---

## 📄 License

**Portfolio Project** | Copyright © 2025 | All Rights Reserved

This repository is provided for **viewing and evaluation purposes only**. The code showcases technical skills and development practices. Setup instructions, API keys, and database schemas are intentionally excluded.

**Unauthorized use, copying, modification, or distribution is strictly prohibited.**
