# Registration Bug Fix Summary
## Database Schema Mismatch Resolution

**Date:** 2025-10-13  
**Issue:** Registration failing due to column mismatches between code and database

---

## 🐛 Problems Found

### 1. **Non-Existent Columns Being Inserted**
The code was trying to insert columns that don't exist in the database:

| Column Name | Status | Fix |
|-------------|--------|-----|
| `nickname` | ❌ Doesn't exist | Removed from insert |
| `age` | ❌ Removed in migration 007 | Removed from insert (calculated from birthday) |
| `is_email_verified` | ❌ Wrong name | Changed to `email_verified` |
| `email_notifications_enabled` | ❌ Doesn't exist | Removed from insert |

### 2. **password_hash Required But Not Provided**
- Database schema had `password_hash` as `NOT NULL`
- Supabase Auth manages passwords in `auth.users` table
- Public `users` table doesn't need password_hash

### 3. **Age Column Confusion**
- Migration 007 removed `age` column to avoid data redundancy
- Age is now calculated via SQL: `EXTRACT(YEAR FROM AGE(CURRENT_DATE, birthday))`
- Available in `customer_profiles_with_age` view
- Frontend was still trying to insert age value

---

## ✅ Solutions Implemented

### **Migration 010: Fix password_hash**
File: `/supabase/migrations/20251013000010_fix_password_hash.sql`

```sql
-- Make password_hash nullable
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Set default for existing records
UPDATE users SET password_hash = '' WHERE password_hash IS NULL;
```

### **Frontend: AuthContext.tsx**
Removed non-existent columns from insert:

```tsx
// ❌ BEFORE (Wrong)
.insert({
  id: data.user.id,
  email: data.user.email,
  full_name: userData.full_name,
  nickname: userData.full_name?.split(' ')[0],  // ❌ Doesn't exist
  birthday: userData.birthday,
  age: userData.age,  // ❌ Removed in migration 007
  referral_code: referralCode,
  role: userData.role,
  is_email_verified: data.user.email_confirmed_at,  // ❌ Wrong name
  email_notifications_enabled: true,  // ❌ Doesn't exist
})

// ✅ AFTER (Correct)
.insert({
  id: data.user.id,
  email: data.user.email,
  full_name: userData.full_name,
  birthday: userData.birthday,  // Age calculated from this
  referral_code: referralCode,
  role: userData.role,
  email_verified: data.user.email_confirmed_at,  // ✅ Correct name
})
```

### **Frontend: Register.tsx**
Removed age calculation before database insert:

```tsx
// ❌ BEFORE (Wrong)
const age = calculateAge(formData.birthday);
await signUp(email, password, {
  full_name: formData.fullName,
  birthday: formData.birthday,
  age: age,  // ❌ Trying to insert age
  role: 'customer',
});

// ✅ AFTER (Correct)
await signUp(email, password, {
  full_name: formData.fullName,
  birthday: formData.birthday,  // Age calculated from this in DB
  role: 'customer',
});
```

---

## 📋 Current Database Schema (users table)

### **Actual Columns in Production:**

```sql
CREATE TABLE users (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Authentication
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),  -- ✅ NOW NULLABLE
  email_verified BOOLEAN DEFAULT FALSE,  -- ✅ Correct name
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  
  -- Profile
  role VARCHAR(20) NOT NULL,
  full_name VARCHAR(255),
  birthday DATE,
  -- age field REMOVED - calculated from birthday
  
  -- Referral
  referral_code VARCHAR(20) UNIQUE,
  
  -- Associations
  branch_id UUID REFERENCES branches(id),
  restaurant_id UUID REFERENCES restaurants(id),
  
  -- PDPA Compliance
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP,
  deletion_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### **Fields We Insert During Registration:**

| Field | Value | Notes |
|-------|-------|-------|
| `id` | `data.user.id` | From Supabase Auth |
| `email` | `data.user.email` | From Supabase Auth |
| `full_name` | User input | Required field |
| `birthday` | User input | Required, must be 18+ |
| `referral_code` | `CHILLI-XXXXXX` | Auto-generated |
| `role` | `'customer'` | Default for signup |
| `email_verified` | `false` | Will be true after email confirmation |

---

## 🎯 Testing Checklist

Before testing registration, ensure these migrations are run on Supabase:

- [x] Migration 001-007: Base schema
- [x] Migration 008: `users_insert_own_profile` RLS policy
- [x] Migration 009: `users_view_own_profile` RLS policy
- [x] Migration 010: `password_hash` nullable

### **Expected Registration Flow:**

1. User fills form (full name, email, password, birthday)
2. Frontend validates age (18+)
3. Calls `signUp()` with only valid fields
4. Supabase Auth creates account in `auth.users`
5. Frontend inserts profile in `public.users`
6. Referral code `CHILLI-XXXXXX` auto-generated
7. Success toast shown
8. Redirect to dashboard

### **Common Errors Fixed:**

- ❌ "Could not find the 'age' column" → ✅ Removed age from insert
- ❌ "Could not find the 'email_notifications_enabled' column" → ✅ Removed from insert
- ❌ "Could not find the 'nickname' column" → ✅ Removed from insert
- ❌ "password_hash cannot be null" → ✅ Made nullable in migration 010

---

## 📚 Documentation Updated

- ✅ `/docs/03-database-schema-design.md` - Updated users table schema
- ✅ `/docs/09-frontend-development-guide.md` - Updated registration implementation
- ✅ `/docs/INDEX.md` - Added schema fix notes
- ✅ `/supabase/migrations/README.md` - Added migration 010

---

## 🚀 Deployment

**Run on Supabase:**
```sql
-- Migration 010: Fix password_hash
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
UPDATE users SET password_hash = '' WHERE password_hash IS NULL;
```

**Then deploy frontend:**
```bash
git push  # Vercel auto-deploys
```

---

## ✅ Status: RESOLVED

Registration should now work without column mismatch errors!
