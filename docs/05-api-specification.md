# API Specification
## MalaChilli - REST API Documentation

**Version:** 1.0  
**Date:** 2025-09-30  
**Base URL:** `https://xxxxx.supabase.co`  
**Authentication:** Bearer Token (JWT)

---

## 1. Authentication

### 1.1 Register User

**Endpoint:** `POST /auth/v1/signup`

**Description:** Register a new user account (customer, staff, or owner).

**Request Headers:**
```
Content-Type: application/json
apikey: {SUPABASE_ANON_KEY}
```

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!",
  "data": {
    "role": "customer",
    "full_name": "John Doe",
    "birthday": "1990-01-15",
    "age": 34,
    "referral_code_used": "SAJI-ABC123"
  }
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "xxxxxxxxxxxxx",
  "user": {
    "id": "uuid-here",
    "email": "customer@example.com",
    "email_confirmed_at": null,
    "user_metadata": {
      "role": "customer",
      "full_name": "John Doe"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email format or weak password
- `422 Unprocessable Entity` - Email already exists

---

### 1.2 Login

**Endpoint:** `POST /auth/v1/token?grant_type=password`

**Description:** Login with email and password.

**Request Headers:**
```
Content-Type: application/json
apikey: {SUPABASE_ANON_KEY}
```

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "xxxxxxxxxxxxx",
  "user": {
    "id": "uuid-here",
    "email": "customer@example.com",
    "role": "customer"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid credentials
- `401 Unauthorized` - Email not verified

---

### 1.3 Password Recovery

**Endpoint:** `POST /auth/v1/recover`

**Description:** Send password recovery email with magic link.

**Request Headers:**
```
Content-Type: application/json
apikey: {SUPABASE_ANON_KEY}
```

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Recovery email sent"
}
```

---

### 1.4 Get Current User

**Endpoint:** `GET /auth/v1/user`

**Description:** Get currently authenticated user details.

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "email": "customer@example.com",
  "role": "customer",
  "email_verified": true,
  "created_at": "2025-09-30T10:00:00Z"
}
```

---

## 2. User Management

### 2.1 Get User Profile

**Endpoint:** `GET /rest/v1/users?id=eq.{user_id}`

**Description:** Get user profile details.

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "email": "customer@example.com",
    "role": "customer",
    "full_name": "John Doe",
    "birthday": "1990-01-15",
    "age": 34,
    "referral_code": "SAJI-XYZ789",
    "created_at": "2025-09-30T10:00:00Z"
  }
]
```

---

### 2.2 Get User by Referral Code

**Endpoint:** `GET /rest/v1/users?referral_code=eq.{code}`

**Description:** Find user by their referral code (for registration flow).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "full_name": "Jane Doe",
    "referral_code": "SAJI-ABC123"
  }
]
```

**Error Responses:**
- `404 Not Found` - Invalid referral code (empty array returned)

---

### 2.3 Update User Profile

**Endpoint:** `PATCH /rest/v1/users?id=eq.{user_id}`

**Description:** Update user profile (limited fields).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "John Updated Doe",
  "birthday": "1990-01-20"
}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-here",
    "full_name": "John Updated Doe",
    "birthday": "1990-01-20"
  }
]
```

---

## 3. Referral Management

### 3.1 Generate Restaurant-Specific Referral Code

**Endpoint:** `POST /rest/v1/rpc/generate_restaurant_referral_code`

**Description:** Generate a unique restaurant-specific referral code for a user. Each user gets one code per restaurant. **Note:** This is called automatically by the backend when a customer makes their first transaction at a restaurant - not called directly by frontend.

**Request Headers:**
```
Authorization: Bearer {access_token}
apikey: {SUPABASE_ANON_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "p_user_id": "uuid-of-user",
  "p_restaurant_id": "uuid-of-restaurant"
}
```

**Response (200 OK):**
```json
{
  "referral_code": "CHILLI-MAMAKS-ABC123",
  "created": true
}
```

**Response (200 OK - Already Exists):**
```json
{
  "referral_code": "CHILLI-MAMAKS-ABC123",
  "created": false
}
```

**Logic:**
1. Check if user already has a code for this restaurant in `user_restaurant_referral_codes`
2. If yes, return existing code
3. If no, generate new code with format: `CHILLI-{restaurant_slug}-{6_random_chars}`
4. Ensure uniqueness across all restaurants
5. Insert into `user_restaurant_referral_codes`

**Error Responses:**
- `400 Bad Request` - Invalid user ID or restaurant ID
- `500 Internal Server Error` - Failed to generate unique code

---

### 3.2 Get User's Restaurant Referral Codes

**Endpoint:** `GET /rest/v1/user_restaurant_referral_codes?user_id=eq.{user_id}&is_active=eq.true&select=*,restaurants(name,slug)`

**Description:** Get all active restaurant-specific referral codes for a user.

**Request Headers:**
```
Authorization: Bearer {access_token}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-code-1",
    "referral_code": "CHILLI-MAMAKS-ABC123",
    "restaurant_id": "uuid-restaurant-1",
    "created_at": "2025-10-13T10:00:00Z",
    "restaurants": {
      "name": "Mamak's Corner",
      "slug": "mamaks-corner"
    }
  },
  {
    "id": "uuid-code-2",
    "referral_code": "CHILLI-NASIL-XYZ789",
    "restaurant_id": "uuid-restaurant-2",
    "created_at": "2025-10-12T15:00:00Z",
    "restaurants": {
      "name": "Nasi Lemak Place",
      "slug": "nasi-lemak-place"
    }
  }
]
```

---

### 3.3 Validate Referral Code for Restaurant

**Endpoint:** `POST /rest/v1/rpc/validate_referral_code`

**Description:** Validate that a referral code exists and belongs to the specified restaurant.

**Request Headers:**
```
Authorization: Bearer {access_token}
apikey: {SUPABASE_ANON_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "p_referral_code": "CHILLI-MAMAKS-ABC123",
  "p_restaurant_id": "uuid-of-restaurant"
}
```

**Response (200 OK - Valid):**
```json
{
  "valid": true,
  "upline_user_id": "uuid-of-code-owner",
  "upline_name": "Alice Customer"
}
```

**Response (200 OK - Invalid):**
```json
{
  "valid": false,
  "error": "Code does not exist for this restaurant"
}
```

**Validation Logic:**
1. Check if code exists in `user_restaurant_referral_codes`
2. Verify `restaurant_id` matches
3. Verify `is_active = true`
4. Return owner's user_id if valid

---

### 3.4 Save Referral Code (Frontend Link Click)

**Endpoint:** `POST /rest/v1/saved_referral_codes`

**Description:** Save a referral code when customer clicks a share link. Code is validated against `user_restaurant_referral_codes` before saving. Used before first transaction at restaurant.

**Request Headers:**
```
Authorization: Bearer {access_token}
apikey: {SUPABASE_ANON_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": "uuid-of-customer",
  "restaurant_id": "uuid-of-restaurant",
  "referral_code": "CHILLI-MAMAKS-ABC123",
  "upline_user_id": "uuid-of-referrer"
}
```

**Logic:**
1. Validate code exists in `user_restaurant_referral_codes` for the specified restaurant
2. Verify `upline_user_id` matches the code owner
3. If valid, save to `saved_referral_codes`

**Response (201 Created):**
```json
{
  "id": "uuid-of-saved-code",
  "user_id": "uuid-of-customer",
  "restaurant_id": "uuid-of-restaurant",
  "referral_code": "CHILLI-MAMAKS-ABC123",
  "is_used": false,
  "saved_at": "2025-10-13T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid referral code or restaurant ID
- `403 Forbidden` - Code does not exist for this restaurant (validation failed)
- `409 Conflict` - Code already saved for this user-restaurant combination

---

### 3.5 Get Saved Referral Codes

**Endpoint:** `GET /rest/v1/saved_referral_codes?user_id=eq.{user_id}&restaurant_id=eq.{restaurant_id}&is_used=eq.false&select=*,users!upline_user_id(full_name)`

**Description:** Get all unused saved codes for a customer at a specific restaurant.

**Request Headers:**
```
Authorization: Bearer {access_token}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-saved-code-1",
    "referral_code": "SAJI-ABC123",
    "saved_at": "2025-09-28T10:00:00Z",
    "users": {
      "full_name": "Friend A"
    }
  },
  {
    "id": "uuid-saved-code-2",
    "referral_code": "SAJI-DEF456",
    "saved_at": "2025-09-29T14:00:00Z",
    "users": {
      "full_name": "Friend B"
    }
  }
]
```

---

### 3.3 Create Referral Chain (RPC)

**Endpoint:** `POST /rest/v1/rpc/create_referral_chain`

**Description:** Create restaurant-specific referral relationships (up to 3 uplines) during first transaction at restaurant.

**Request Headers:**
```
Authorization: Bearer {access_token}
apikey: {SUPABASE_ANON_KEY}
```

**Request Body:**
```json
{
  "p_downline_id": "uuid-of-customer",
  "p_referral_code": "SAJI-ABC123",
  "p_restaurant_id": "uuid-of-restaurant"
}
```

**Response (200 OK):**
```json
{
  "message": "Referral chain created successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid referral code or restaurant ID
- `409 Conflict` - Customer already has referral chain at this restaurant

---

### 3.4 Get User's Uplines

**Endpoint:** `GET /rest/v1/referrals?downline_id=eq.{user_id}&restaurant_id=eq.{restaurant_id}&select=upline_id,upline_level,users(full_name,referral_code)`

**Description:** Get all uplines for a user at a specific restaurant (who referred them).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "upline_id": "uuid-level-1",
    "upline_level": 1,
    "users": {
      "full_name": "Direct Referrer",
      "referral_code": "SAJI-ABC123"
    }
  },
  {
    "upline_id": "uuid-level-2",
    "upline_level": 2,
    "users": {
      "full_name": "Level 2 Referrer",
      "referral_code": "SAJI-DEF456"
    }
  }
]
```

---

### 3.5 Get User's Downlines

**Endpoint:** `GET /rest/v1/referrals?upline_id=eq.{user_id}&restaurant_id=eq.{restaurant_id}&select=downline_id,upline_level,users(full_name,referral_code,created_at)`

**Description:** Get all downlines for a user at a specific restaurant (who they referred).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "downline_id": "uuid-downline-1",
    "upline_level": 1,
    "users": {
      "full_name": "Downline 1",
      "referral_code": "SAJI-GHI789",
      "created_at": "2025-09-25T10:00:00Z"
    }
  },
  {
    "downline_id": "uuid-downline-2",
    "upline_level": 2,
    "users": {
      "full_name": "Downline 2 (via Downline 1)",
      "referral_code": "SAJI-JKL012",
      "created_at": "2025-09-28T14:30:00Z"
    }
  }
]
```

---

### 3.4 Get Downline Count

**Endpoint:** `GET /rest/v1/customer_downlines?user_id=eq.{user_id}`

**Description:** Get total downline count by level (uses view).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "user_id": "uuid-here",
    "upline_level": 1,
    "downline_count": 5
  },
  {
    "user_id": "uuid-here",
    "upline_level": 2,
    "downline_count": 12
  },
  {
    "user_id": "uuid-here",
    "upline_level": 3,
    "downline_count": 23
  }
]
```

---

## 4. Virtual Currency & Wallet

### 4.1 Get Wallet Balance

**Endpoint:** `GET /rest/v1/customer_wallet_balance?user_id=eq.{user_id}`

**Description:** Get current virtual currency balance (uses view).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "user_id": "uuid-here",
    "current_balance": 15.50,
    "last_transaction_date": "2025-09-29T18:45:00Z"
  }
]
```

---

### 4.2 Get Wallet Transaction History

**Endpoint:** `GET /rest/v1/virtual_currency_ledger?user_id=eq.{user_id}&order=created_at.desc`

**Description:** Get all virtual currency transactions (earnings, redemptions, expiry).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-transaction-1",
    "transaction_type": "earn",
    "amount": 2.50,
    "balance_after": 15.50,
    "related_user_id": "uuid-downline",
    "upline_level": 1,
    "expires_at": "2025-10-29T18:45:00Z",
    "created_at": "2025-09-29T18:45:00Z",
    "notes": null
  },
  {
    "id": "uuid-transaction-2",
    "transaction_type": "redeem",
    "amount": -5.00,
    "balance_after": 13.00,
    "related_transaction_id": "uuid-checkout",
    "expires_at": null,
    "created_at": "2025-09-28T12:30:00Z",
    "notes": null
  },
  {
    "id": "uuid-transaction-3",
    "transaction_type": "expire",
    "amount": -1.00,
    "balance_after": 18.00,
    "expires_at": "2025-08-30T00:00:00Z",
    "expired_at": "2025-09-30T02:00:00Z",
    "created_at": "2025-09-30T02:00:00Z",
    "notes": "Expired earning from 2025-08-30"
  }
]
```

---

### 4.3 Redeem Virtual Currency (RPC)

**Endpoint:** `POST /rest/v1/rpc/redeem_virtual_currency`

**Description:** Redeem virtual currency at checkout (called during transaction creation).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "p_user_id": "uuid-customer",
  "p_transaction_id": "uuid-transaction",
  "p_redeem_amount": 5.00
}
```

**Response (200 OK):**
```json
{
  "message": "Virtual currency redeemed successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Insufficient balance
- `422 Unprocessable Entity` - Redeem amount exceeds 20% of bill

---

## 5. Transactions

### 5.1 Create Transaction

**Endpoint:** `POST /rest/v1/transactions`

**Description:** Record a checkout transaction (staff only).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "customer_id": "uuid-customer",
  "branch_id": "uuid-branch",
  "staff_id": "uuid-staff",
  "bill_amount": 100.00,
  "guaranteed_discount_amount": 5.00,
  "virtual_currency_redeemed": 3.00,
  "is_first_transaction": true,
  "receipt_photo_url": "https://xxxxx.supabase.co/storage/v1/object/public/receipt-photos/uuid.jpg"
}
```

**Response (201 Created):**
```json
[
  {
    "id": "uuid-transaction",
    "customer_id": "uuid-customer",
    "branch_id": "uuid-branch",
    "staff_id": "uuid-staff",
    "bill_amount": 100.00,
    "guaranteed_discount_amount": 5.00,
    "virtual_currency_redeemed": 3.00,
    "total_discount": 8.00,
    "final_amount": 92.00,
    "is_first_transaction": true,
    "transaction_date": "2025-09-30T15:30:00Z",
    "created_at": "2025-09-30T15:30:00Z"
  }
]
```

**Post-Creation Actions (Automatic via Triggers):**
1. Call `redeem_virtual_currency()` if `virtual_currency_redeemed > 0`
2. Call `distribute_upline_rewards()` to give 1% to uplines

---

### 5.2 Get Customer Transactions

**Endpoint:** `GET /rest/v1/transactions?customer_id=eq.{user_id}&order=transaction_date.desc&select=*,branches(name)`

**Description:** Get all transactions for a customer.

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-transaction-1",
    "bill_amount": 100.00,
    "total_discount": 8.00,
    "final_amount": 92.00,
    "transaction_date": "2025-09-30T15:30:00Z",
    "branches": {
      "name": "Main Branch"
    }
  },
  {
    "id": "uuid-transaction-2",
    "bill_amount": 75.00,
    "total_discount": 5.00,
    "final_amount": 70.00,
    "transaction_date": "2025-09-25T12:15:00Z",
    "branches": {
      "name": "KLCC Branch"
    }
  }
]
```

---

### 5.3 Get Branch Transactions (Staff/Owner)

**Endpoint:** `GET /rest/v1/transactions?branch_id=eq.{branch_id}&order=transaction_date.desc&select=*,users!customer_id(full_name,referral_code)`

**Description:** Get all transactions for a branch (for analytics).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-transaction-1",
    "customer_id": "uuid-customer-1",
    "bill_amount": 100.00,
    "total_discount": 8.00,
    "final_amount": 92.00,
    "transaction_date": "2025-09-30T15:30:00Z",
    "users": {
      "full_name": "John Doe",
      "referral_code": "SAJI-XYZ789"
    }
  }
]
```

---

### 5.4 Distribute Upline Rewards (RPC)

**Endpoint:** `POST /rest/v1/rpc/distribute_upline_rewards`

**Description:** Distribute 1% rewards to uplines (called automatically after transaction creation).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "p_transaction_id": "uuid-transaction",
  "p_customer_id": "uuid-customer",
  "p_bill_amount": 100.00
}
```

**Response (200 OK):**
```json
{
  "message": "Upline rewards distributed successfully",
  "rewards_count": 3
}
```

---

## 6. Restaurant & Branch Management

### 6.1 Get Restaurant by Slug

**Endpoint:** `GET /rest/v1/restaurants?slug=eq.{restaurant_slug}`

**Description:** Get restaurant by URL-friendly slug (used for referral links).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-restaurant",
    "name": "Nasi Lemak Corner",
    "slug": "nasi-lemak-corner",
    "description": "Authentic Malaysian cuisine",
    "logo_url": "https://example.com/logo.png",
    "guaranteed_discount_percent": 5.00,
    "is_active": true
  }
]
```

**Error Responses:**
- `404 Not Found` - Invalid restaurant slug (empty array)

---

### 6.2 Get Restaurant Details

**Endpoint:** `GET /rest/v1/restaurants?id=eq.{restaurant_id}`

**Description:** Get restaurant configuration and details.

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-restaurant",
    "name": "Test Restaurant",
    "description": "MVP Pilot Restaurant",
    "logo_url": "https://example.com/logo.png",
    "guaranteed_discount_percent": 5.00,
    "upline_reward_percent": 1.00,
    "max_redemption_percent": 20.00,
    "virtual_currency_expiry_days": 30,
    "is_active": true,
    "created_at": "2025-09-01T00:00:00Z"
  }
]
```

---

### 6.2 Get Restaurant Branches

**Endpoint:** `GET /rest/v1/branches?restaurant_id=eq.{restaurant_id}&is_active=eq.true`

**Description:** Get all active branches for a restaurant.

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-branch-1",
    "restaurant_id": "uuid-restaurant",
    "name": "Main Branch",
    "address": "123 Test St, Kuala Lumpur",
    "phone": "+60123456789",
    "is_active": true,
    "created_at": "2025-09-01T00:00:00Z"
  },
  {
    "id": "uuid-branch-2",
    "restaurant_id": "uuid-restaurant",
    "name": "KLCC Branch",
    "address": "456 KLCC, Kuala Lumpur",
    "phone": "+60198765432",
    "is_active": true,
    "created_at": "2025-09-15T00:00:00Z"
  }
]
```

---

### 6.3 Update Restaurant Configuration (Owner Only)

**Endpoint:** `PATCH /rest/v1/restaurants?id=eq.{restaurant_id}`

**Description:** Update restaurant discount parameters (owner only).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "guaranteed_discount_percent": 4.00,
  "upline_reward_percent": 0.75,
  "virtual_currency_expiry_days": 45
}
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-restaurant",
    "guaranteed_discount_percent": 4.00,
    "upline_reward_percent": 0.75,
    "virtual_currency_expiry_days": 45
  }
]
```

---

## 7. Analytics (Owner Portal)

### 7.1 Get Restaurant Analytics Summary

**Endpoint:** `GET /rest/v1/restaurant_analytics_summary?restaurant_id=eq.{restaurant_id}`

**Description:** Get aggregated analytics for restaurant (uses view).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "restaurant_id": "uuid-restaurant",
    "total_customers": 150,
    "total_transactions": 320,
    "total_revenue": 32000.00,
    "total_discounts": 2560.00,
    "net_revenue": 29440.00,
    "avg_bill_amount": 100.00,
    "new_customers": 45
  }
]
```

---

### 7.2 Get Analytics by Date Range

**Endpoint:** `GET /rest/v1/transactions?branch_id=in.(uuid1,uuid2)&transaction_date=gte.2025-09-01&transaction_date=lte.2025-09-30&select=bill_amount.sum(),total_discount.sum(),count()`

**Description:** Get aggregated metrics for custom date range.

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "sum": 32000.00,
    "sum_1": 2560.00,
    "count": 320
  }
]
```

---

### 7.3 Get Top Referrers

**Endpoint:** `GET /rest/v1/referrals?select=upline_id,users(full_name,referral_code),count()&group=upline_id&order=count.desc&limit=10`

**Description:** Get top 10 customers by downline count.

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
[
  {
    "upline_id": "uuid-customer-1",
    "users": {
      "full_name": "Top Referrer",
      "referral_code": "SAJI-ABC123"
    },
    "count": 25
  },
  {
    "upline_id": "uuid-customer-2",
    "users": {
      "full_name": "Second Referrer",
      "referral_code": "SAJI-DEF456"
    },
    "count": 18
  }
]
```

---

## 8. File Storage

### 8.1 Upload Receipt Photo

**Endpoint:** `POST /storage/v1/object/receipt-photos/{filename}`

**Description:** Upload receipt photo (staff only, during transaction creation).

**Request Headers:**
```
Authorization: Bearer {ACCESS_TOKEN}
apikey: {SUPABASE_ANON_KEY}
Content-Type: image/jpeg
```

**Request Body:** Binary image data

**Response (200 OK):**
```json
{
  "Key": "receipt-photos/uuid-transaction_1696089600.jpg",
  "Id": "uuid-file"
}
```

**File URL:** `https://xxxxx.supabase.co/storage/v1/object/public/receipt-photos/uuid-transaction_1696089600.jpg`

---

### 8.2 Get Receipt Photo

**Endpoint:** `GET /storage/v1/object/public/receipt-photos/{filename}`

**Description:** Retrieve uploaded receipt photo (public read).

**Response:** Image file (JPEG/PNG)

---

## 9. Cron Jobs (Edge Functions)

### 9.1 Expire Virtual Currency (Daily)

**Endpoint:** `POST /rest/v1/rpc/expire_virtual_currency`

**Description:** Expire virtual currency past expiry date (triggered by cron, not manually).

**Request Headers:**
```
Authorization: Bearer {SERVICE_ROLE_KEY}
apikey: {SUPABASE_ANON_KEY}
```

**Response (200 OK):**
```json
{
  "expired_count": 15,
  "message": "15 virtual currency balances expired"
}
```

---

## 10. Error Responses

### Standard Error Format

All errors follow this format:

```json
{
  "error": "Error message here",
  "code": "ERROR_CODE",
  "details": "Additional details (optional)"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions (RLS policy violation)
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `422 Unprocessable Entity` - Validation error (e.g., weak password)
- `500 Internal Server Error` - Server error (contact support)

---

## 11. Rate Limiting

### Supabase Rate Limits (Free Tier)

- **Auth Endpoints:** 30 requests/hour per IP
- **REST API:** 100 requests/second per project
- **Storage:** 50 uploads/minute per user

### Handling Rate Limits

If rate limit exceeded, response:

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 60
}
```

**Client Action:** Wait `retry_after` seconds before retrying.

---

## 12. Pagination

### Query Parameters

- `limit` - Number of results per page (default: 10, max: 1000)
- `offset` - Number of results to skip (for pagination)

### Example

```
GET /rest/v1/transactions?customer_id=eq.{id}&limit=20&offset=40
```

**Response Headers:**
```
Content-Range: 40-59/150
```

---

## 13. Filtering & Sorting

### Filter Operators

- `eq` - Equals: `?column=eq.value`
- `neq` - Not equals: `?column=neq.value`
- `gt` - Greater than: `?column=gt.value`
- `gte` - Greater than or equal: `?column=gte.value`
- `lt` - Less than: `?column=lt.value`
- `lte` - Less than or equal: `?column=lte.value`
- `like` - Pattern match: `?column=like.*value*`
- `in` - In list: `?column=in.(value1,value2)`

### Sorting

- `order` - Sort by column: `?order=column.asc` or `?order=column.desc`

### Example

```
GET /rest/v1/transactions?bill_amount=gte.100&order=transaction_date.desc
```

---

## 14. Appendix: Postman Collection

A Postman collection with all endpoints is available at:
`/docs/postman/MalaChilli-API.postman_collection.json`

Import into Postman for easy testing.

---

**Document Approval:**
- [ ] Backend Developer
- [ ] Frontend Developer
- [ ] QA Engineer

**Next Steps:**
1. Review and approve API specification
2. Create Postman collection
3. Implement API service layer in frontend
4. Write integration tests
