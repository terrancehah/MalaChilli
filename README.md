# MalaChilli 🍽️

**Full-Stack Restaurant Loyalty Platform**

A modern web application built with React and Supabase that enables restaurants to manage customer loyalty programs with referral mechanics and real-time analytics.

> **Note:** This repository serves as a technical portfolio showcase. Proprietary business logic, database schemas, and detailed documentation are excluded to protect intellectual property.

---

## 🎯 Project Highlights

This project demonstrates proficiency in:
- **Full-stack development** with modern JavaScript ecosystem
- **Database design** with PostgreSQL and complex relational schemas
- **Real-time features** using Supabase subscriptions
- **Authentication & authorization** with JWT and Row-Level Security
- **Responsive UI/UX** with React and Tailwind CSS
- **Cloud deployment** on Vercel and Supabase platforms

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              Frontend (React)                    │
│  • React 18 + TypeScript                        │
│  • Tailwind CSS for styling                     │
│  • React Router for navigation                  │
│  • Vite for blazing-fast builds                 │
└─────────────────┬───────────────────────────────┘
                  │ HTTPS/REST API
┌─────────────────┴───────────────────────────────┐
│           Backend (Supabase)                     │
│  • PostgreSQL 15 database                       │
│  • Supabase Auth for user management            │
│  • Row-Level Security (RLS) policies            │
│  • Edge Functions for serverless logic          │
│  • Storage for file uploads                     │
└──────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18+** with TypeScript - Type-safe component development
- **Vite** - Lightning-fast dev server and optimized builds
- **Tailwind CSS** - Utility-first styling with custom design system
- **shadcn/ui** - Accessible component library
- **React Router v6** - Client-side routing
- **Context API** - State management for auth and global state
- **react-qr-code** - QR code generation
- **html5-qrcode** - Camera-based QR scanning

### Backend
- **Supabase** - Backend-as-a-Service platform
  - PostgreSQL 15 (relational database)
  - Supabase Auth (JWT-based authentication)
  - Row-Level Security (data access control)
  - Edge Functions (serverless compute)
  - Storage (file uploads)
- **Email Service** - Transactional emails via SendGrid

### DevOps & Infrastructure
- **Vercel** - Frontend hosting with automatic deployments
- **GitHub** - Version control and collaboration
- **ESLint + Prettier** - Code quality and formatting

---

## 📁 Project Structure

```
MalaChilli/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── contexts/        # React Context providers
│   │   ├── pages/           # Route components
│   │   │   └── customer/    # Customer-facing pages
│   │   ├── lib/             # Utilities and configs
│   │   │   ├── supabase.ts  # Supabase client setup
│   │   │   └── utils.ts     # Helper functions
│   │   └── types/           # TypeScript definitions
│   ├── public/              # Static assets
│   └── package.json         # Dependencies
├── docs/                    # Technical documentation (private)
└── supabase/                # Database migrations (private)
```

---

## ✨ Key Features Implemented

### User Authentication
- Email/password registration with verification
- Secure login with JWT tokens
- Password recovery flow
- Role-based access control (customer, staff, owner)

### Customer Portal
- User dashboard with profile management
- QR code display for referral sharing
- Wallet system with transaction history
- Referral tracking and network visualization

### Staff Interface
- QR code scanner for customer verification
- Transaction processing workflow
- Receipt photo upload
- Real-time discount calculations

### Analytics Dashboard
- Transaction metrics and reporting
- Customer acquisition tracking
- Revenue and discount analytics
- Export capabilities

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend services)
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MalaChilli.git
cd MalaChilli
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your Supabase credentials to .env
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🏗️ Technical Highlights

### Database Design
- Complex relational schema with referential integrity
- Optimized indexes for query performance
- Stored procedures for business logic encapsulation
- Views for efficient data aggregation

### Security Implementation
- Row-Level Security (RLS) policies for data isolation
- Bcrypt password hashing
- JWT token-based authentication
- Input validation and sanitization
- HTTPS/TLS encryption for all communications

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Accessible UI components following WCAG guidelines
- Cross-browser compatibility
- Progressive Web App (PWA) capabilities

### Performance Optimization
- Code splitting with React lazy loading
- Image optimization and compression
- Efficient state management
- Minimal bundle size with tree-shaking

---

## 📊 Development Workflow

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Prettier for formatting
- Component-driven development

### Version Control
- Git branching strategy (feature branches)
- Pull request reviews
- Semantic commit messages

### Deployment
- Automatic deployments via Vercel
- Preview deployments for pull requests
- Environment-specific configurations

---

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

---

## 🤝 Contributing

This is a private portfolio project. Contributions are not currently accepted.

---

## 📄 License

Copyright © 2025. All rights reserved.

This is proprietary software developed for portfolio demonstration purposes. The code is provided for viewing only. Unauthorized copying, modification, distribution, or commercial use is strictly prohibited.

---

## 👨‍💻 Developer

Built as a full-stack portfolio project demonstrating modern web development practices, cloud architecture, and scalable application design.

**Tech Stack:** React • TypeScript • Tailwind CSS • Supabase • PostgreSQL • Vercel

---

**Portfolio Project** | **2025**
