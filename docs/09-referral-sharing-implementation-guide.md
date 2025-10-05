# Referral Sharing Implementation Guide
## ShareSaji - Code/QR Sharing Flow

**Version:** 1.0  
**Date:** 2025-10-05  
**Status:** Implementation Ready  
**Context:** Restaurant-Specific Referral Model

---

## 1. Overview

This guide details the implementation of the referral sharing and code redemption flow in ShareSaji, following the **restaurant-specific referral model** where each restaurant builds its own referral network.

### 1.1 Key Principles

- **One Code, Multiple Networks:** User has ONE referral code but different upline chains per restaurant
- **Restaurant-Specific Links:** Share links include restaurant context
- **Saved Codes Collection:** Codes saved before first visit
- **Fair Attribution:** Each restaurant only pays for their own customer acquisitions

---

## 2. URL Structure

### 2.1 Referral Share Link Format

```
https://sharesaji.com/join/:restaurantSlug/:referralCode
```

**Examples:**
- `https://sharesaji.com/join/nasi-lemak-corner/SAJI-ABC123`
- `https://sharesaji.com/join/mamas-kitchen/SAJI-DEF456`

**Components:**
- `restaurantSlug`: URL-friendly restaurant identifier (e.g., "nasi-lemak-corner")
- `referralCode`: User's unique code (e.g., "SAJI-ABC123")

### 2.2 Referral Code Format

**Format:** `SAJI-` + 6 alphanumeric characters (uppercase)

**Examples:**
- `SAJI-ABC123`
- `SAJI-XYZ789`
- `SAJI-M3N4K5`

**Generation Logic:**
```javascript
function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SAJI-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

**Uniqueness Check:**
- Query database to ensure code doesn't exist
- Retry with new random code if collision detected

---

## 3. User Flows

### 3.1 Flow A: Share Link (Customer A shares to Customer B)

```
┌─────────────────────────────────────────────────────────────┐
│ CUSTOMER A (Existing User at Restaurant X)                 │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ 1. Opens Customer Dashboard
                        ▼
            ┌───────────────────────┐
            │  Share Section        │
            │  Code: SAJI-ABC123    │
            │  [Copy Link]          │
            │  [WhatsApp] [Facebook]│
            └───────────────────────┘
                        │
                        │ 2. Clicks "WhatsApp"
                        ▼
            ┌───────────────────────┐
            │ Pre-filled Message:   │
            │ "Join me at Nasi      │
            │ Lemak Corner! Use my  │
            │ code for discount:    │
            │ sharesaji.com/join/   │
            │ nasi-lemak-corner/    │
            │ SAJI-ABC123"          │
            └───────────────────────┘
                        │
                        │ 3. Sends to Customer B
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ CUSTOMER B (Receives Link)                                  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Flow B: Link Click & Code Save

```
CUSTOMER B clicks link: sharesaji.com/join/nasi-lemak-corner/SAJI-ABC123

                        │
                        ▼
            ┌───────────────────────┐
            │  Is Customer B        │
            │  registered?          │
            └───────────────────────┘
                        │
           ┌────────────┴────────────┐
           │                         │
       NO  ▼                     YES ▼
┌──────────────────┐    ┌──────────────────────┐
│ Registration Page│    │ Check if already     │
│ Restaurant: Nasi │    │ visited Restaurant X │
│ Lemak Corner     │    └──────────────────────┘
│ (pre-selected)   │                │
│                  │       ┌────────┴────────┐
│ Email: ______    │   NO  ▼             YES ▼
│ Password: ____   │ ┌──────────┐   ┌──────────┐
│ Birthday: ____   │ │ Save code│   │ Show msg:│
│                  │ │ to saved_│   │"You've   │
│ [Optional]       │ │ referral_│   │already   │
│ Referral code:   │ │ codes    │   │used a    │
│ SAJI-ABC123      │ │ table    │   │code at   │
│ (read-only)      │ └──────────┘   │this      │
│                  │       │         │restaurant│
│ [Sign Up]        │       │         └──────────┘
└──────────────────┘       │
           │               │
           │ After signup  │
           ▼               │
    ┌──────────────┐       │
    │ Save code to │       │
    │ saved_       │       │
    │ referral_    │       │
    │ codes table  │       │
    └──────────────┘       │
           │               │
           └───────┬───────┘
                   ▼
        ┌──────────────────┐
        │ Success Message: │
        │ "Referral code   │
        │ saved for Nasi   │
        │ Lemak Corner!    │
        │ Visit the        │
        │ restaurant to    │
        │ redeem."         │
        └──────────────────┘
```

### 3.3 Flow C: Physical Visit & Code Redemption

```
CUSTOMER B visits Nasi Lemak Corner physically

                        │
                        ▼
            ┌───────────────────────┐
            │ Staff: "Do you have   │
            │ a referral code?"     │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ Customer B opens app  │
            │ "Saved Codes" section │
            │                       │
            │ Nasi Lemak Corner:    │
            │ • SAJI-ABC123         │
            │   (from Friend A)     │
            │   [Use This Code]     │
            └───────────────────────┘
                        │
                        │ Customer selects code
                        ▼
            ┌───────────────────────┐
            │ Staff enters code in  │
            │ Staff Portal          │
            │ Code: SAJI-ABC123     │
            │ [Verify]              │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ System checks:        │
            │ 1. Is this customer's │
            │    first visit at     │
            │    this restaurant?   │
            │ 2. Valid code?        │
            └───────────────────────┘
                        │
                    YES ▼
            ┌───────────────────────┐
            │ Process Transaction:  │
            │ Bill: RM100           │
            │ Guaranteed: -RM5 (5%) │
            │ VC Redeem: -RM0       │
            │ Total: RM95           │
            │ [Confirm]             │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ Backend Actions:      │
            │ 1. Create transaction │
            │ 2. Create referral    │
            │    chain (Customer B  │
            │    → Customer A at    │
            │    Restaurant X)      │
            │ 3. Mark saved code    │
            │    as used            │
            │ 4. Create customer_   │
            │    restaurant_history │
            │ 5. Distribute upline  │
            │    rewards (RM1 to A) │
            └───────────────────────┘
```

### 3.4 Flow D: Skip Referral Code (Optional)

```
Customer visits restaurant WITHOUT a saved code

                        │
                        ▼
            ┌───────────────────────┐
            │ Staff: "Referral      │
            │ code?"                │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ Customer: "I don't    │
            │ have one"             │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ Staff selects:        │
            │ [Skip Code] button    │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ Process as first-time │
            │ customer at this      │
            │ restaurant            │
            │ Guaranteed: 5%        │
            │ No upline rewards     │
            └───────────────────────┘
```

---

## 4. Database Operations

### 4.1 Link Click Handler

**Route:** `GET /join/:restaurantSlug/:referralCode`

**Steps:**
1. Lookup restaurant by slug
2. Validate referral code exists and belongs to active customer
3. Check if user is logged in
   - If NO → Redirect to registration with pre-filled code
   - If YES → Proceed to step 4
4. Check if user already has referral chain at this restaurant
   - If YES → Show message "Already used code at this restaurant"
   - If NO → Proceed to step 5
5. Insert into `saved_referral_codes`:
   ```sql
   INSERT INTO saved_referral_codes (
     user_id,
     restaurant_id,
     referral_code,
     upline_user_id
   ) VALUES (?, ?, ?, ?)
   ON CONFLICT (user_id, restaurant_id, referral_code) DO NOTHING;
   ```
6. Show success message with call-to-action

### 4.2 First Transaction at Restaurant

**Trigger:** Staff processes checkout with customer code

**Steps:**
1. Check if customer has visited this restaurant before:
   ```sql
   SELECT EXISTS (
     SELECT 1 FROM customer_restaurant_history
     WHERE customer_id = ? AND restaurant_id = ?
   );
   ```

2. If first visit:
   - Apply 5% guaranteed discount
   - Check for saved referral codes:
     ```sql
     SELECT * FROM saved_referral_codes
     WHERE user_id = ? 
       AND restaurant_id = ?
       AND is_used = FALSE
     LIMIT 1;
     ```
   
3. If saved code found:
   - Call `create_referral_chain(customer_id, referral_code, restaurant_id)`
   - Mark saved code as used:
     ```sql
     UPDATE saved_referral_codes
     SET is_used = TRUE, used_at = NOW()
     WHERE id = ?;
     ```

4. Create transaction record

5. Call `distribute_upline_rewards(transaction_id, customer_id, bill_amount)`

6. Insert/update `customer_restaurant_history`:
   ```sql
   INSERT INTO customer_restaurant_history (
     customer_id,
     restaurant_id,
     referral_code_used,
     total_spent
   ) VALUES (?, ?, ?, ?)
   ON CONFLICT (customer_id, restaurant_id)
   DO UPDATE SET
     total_visits = customer_restaurant_history.total_visits + 1,
     total_spent = customer_restaurant_history.total_spent + EXCLUDED.total_spent,
     last_visit_date = NOW();
   ```

---

## 5. Frontend Components

### 5.1 Customer Dashboard - Share Section

**Location:** Customer Portal `/dashboard`

**UI Components:**
```jsx
<ShareSection>
  <YourCodeDisplay>
    <Label>Your Referral Code</Label>
    <Code>SAJI-ABC123</Code>
    <CopyButton>Copy Code</CopyButton>
  </YourCodeDisplay>

  <ShareLinksSection>
    <Heading>Share to Friends</Heading>
    <RestaurantSelector>
      <Select>
        <Option value="restaurant-x-id">Nasi Lemak Corner</Option>
        {/* Other restaurants user has visited */}
      </Select>
    </RestaurantSelector>
    
    <ShareLink>
      sharesaji.com/join/nasi-lemak-corner/SAJI-ABC123
      <CopyLinkButton>Copy Link</CopyLinkButton>
    </ShareLink>

    <SocialButtons>
      <WhatsAppButton>Share via WhatsApp</WhatsAppButton>
      <FacebookButton>Share via Facebook</FacebookButton>
      <InstagramButton>Copy for Instagram</InstagramButton>
    </SocialButtons>
  </ShareLinksSection>

  <QRSection>
    <Heading>QR Code (Coming Soon)</Heading>
    <PlaceholderBox>
      QR code generator will be available in Phase 2
    </PlaceholderBox>
  </QRSection>
</ShareSection>
```

**Pre-filled Social Messages:**
- **WhatsApp:**
  ```
  Join me at [Restaurant Name] and save on your meal! 
  Use my code for a discount: 
  sharesaji.com/join/[restaurant-slug]/[your-code]
  ```

- **Facebook:**
  ```
  Just discovered [Restaurant Name] - amazing food! 
  Get a discount on your first visit: 
  sharesaji.com/join/[restaurant-slug]/[your-code]
  ```

### 5.2 Customer Dashboard - Saved Codes Section

**Location:** Customer Portal `/dashboard/saved-codes`

**UI Components:**
```jsx
<SavedCodesSection>
  <Heading>Your Saved Referral Codes</Heading>
  <Description>
    These codes are ready to use when you visit these restaurants
  </Description>

  <SavedCodesList>
    {savedCodes.map(code => (
      <SavedCodeCard key={code.id}>
        <RestaurantName>{code.restaurant.name}</RestaurantName>
        <CodeDisplay>{code.referral_code}</CodeDisplay>
        <ReferrerName>From: {code.upline_user.full_name}</ReferrerName>
        <SavedDate>Saved: {formatDate(code.saved_at)}</SavedDate>
        <StatusBadge>Ready to Use</StatusBadge>
      </SavedCodeCard>
    ))}
  </SavedCodesList>
</SavedCodesSection>
```

### 5.3 Staff Portal - Code Verification

**Location:** Staff Portal `/staff/checkout`

**UI Components:**
```jsx
<CheckoutInterface>
  <CustomerCodeInput>
    <Label>Customer Referral Code</Label>
    <InputGroup>
      <TextInput 
        placeholder="SAJI-ABC123" 
        onChange={handleCodeInput}
      />
      <ScanButton>
        <QRIcon /> Scan QR (Phase 2)
      </ScanButton>
    </InputGroup>
    <VerifyButton onClick={verifyCode}>Verify</VerifyButton>
  </CustomerCodeInput>

  {codeVerified && (
    <CustomerInfo>
      <Name>{customer.full_name}</Name>
      <WalletBalance>Balance: RM{customer.balance}</WalletBalance>
      <FirstVisitBadge>
        {isFirstVisit ? "First Visit - 5% Discount Applies" : "Returning Customer"}
      </FirstVisitBadge>
      
      {hasSavedCodes && (
        <SavedCodesList>
          <Label>Saved Codes for This Restaurant:</Label>
          {savedCodes.map(code => (
            <CodeOption key={code.id}>
              <Radio 
                name="selected_code" 
                value={code.referral_code}
              />
              {code.referral_code} (from {code.upline_name})
            </CodeOption>
          ))}
          <CodeOption>
            <Radio name="selected_code" value="none" />
            Skip referral code
          </CodeOption>
        </SavedCodesList>
      )}
    </CustomerInfo>
  )}

  <BillCalculation>
    <BillAmount>
      <Label>Bill Amount:</Label>
      <Input type="number" value={billAmount} />
    </BillAmount>
    
    <Discounts>
      <GuaranteedDiscount>
        Guaranteed (5%): -RM{calculateGuaranteed()}
      </GuaranteedDiscount>
      <VCRedemption>
        VC Redemption: -RM{vcRedeemed}
        <RedeemSlider max={maxRedeemable} />
      </VCRedemption>
    </Discounts>

    <FinalAmount>
      Total: RM{finalAmount}
    </FinalAmount>

    <SubmitButton>Process Transaction</SubmitButton>
  </BillCalculation>
</CheckoutInterface>
```

---

## 6. Edge Cases & Error Handling

### 6.1 Invalid Restaurant Slug

**Scenario:** User clicks `sharesaji.com/join/invalid-restaurant/SAJI-ABC123`

**Handling:**
- Show error page: "Restaurant not found"
- Suggest browsing restaurant directory (Phase 2)
- Allow manual code entry on registration

### 6.2 Invalid Referral Code

**Scenario:** User clicks link with non-existent code

**Handling:**
- Show message: "This referral code is invalid or expired"
- Redirect to registration without pre-filled code
- Log attempt for analytics

### 6.3 Code Already Used at Restaurant

**Scenario:** User tries to use second referral code at same restaurant

**Handling:**
- Block action
- Show message: "You've already used a referral code at [Restaurant Name]. Your existing referral chain: [Upline Name]"
- Proceed with transaction without creating new chain

### 6.4 Self-Referral Attempt

**Scenario:** User A tries to use their own code

**Handling:**
- Database constraint prevents: `CHECK (downline_id != upline_id)`
- Show friendly error: "You cannot use your own referral code"
- Allow transaction to proceed without referral

### 6.5 User Clicks Multiple Links for Same Restaurant

**Scenario:** User clicks Friend A's link, then Friend B's link (both for Restaurant X)

**Handling:**
- Both codes saved to `saved_referral_codes`
- At checkout, staff shows list of available codes
- Customer chooses which friend to credit
- Unchosen codes remain available for future use

---

## 7. Testing Scenarios

### 7.1 Unit Tests

**Test: Generate Unique Referral Code**
```javascript
describe('generateReferralCode', () => {
  it('should generate code with correct format', () => {
    const code = generateReferralCode();
    expect(code).toMatch(/^SAJI-[A-Z0-9]{6}$/);
  });

  it('should generate unique codes', () => {
    const codes = new Set();
    for (let i = 0; i < 1000; i++) {
      codes.add(generateReferralCode());
    }
    expect(codes.size).toBe(1000);
  });
});
```

**Test: Save Referral Code**
```javascript
describe('saveReferralCode', () => {
  it('should save code on first click', async () => {
    const result = await saveReferralCode({
      userId: 'user-b',
      restaurantId: 'restaurant-x',
      referralCode: 'SAJI-ABC123'
    });
    expect(result.is_used).toBe(false);
  });

  it('should not duplicate on second click', async () => {
    await saveReferralCode({ /* same params */ });
    const count = await getSavedCodesCount('user-b', 'restaurant-x');
    expect(count).toBe(1);
  });
});
```

### 7.2 Integration Tests

**Test: End-to-End Referral Flow**
1. User A registers at Restaurant X → Gets code `SAJI-AAA111`
2. User A shares link with User B
3. User B clicks link → Code saved
4. User B visits Restaurant X → Uses code
5. Verify:
   - User B has 5% discount applied
   - Referral chain created (B → A at Restaurant X)
   - User A earns RM1 when User B spends RM100
   - Saved code marked as used

**Test: Multi-Restaurant Scenario**
1. User A registers at Restaurant X
2. User B uses User A's code at Restaurant X → Chain created
3. User C uses User B's code at Restaurant Y → Separate chain
4. User C spends RM100 at Restaurant Y
5. Verify:
   - User B earns RM1 (paid by Restaurant Y)
   - User A earns NOTHING (no chain at Restaurant Y)

### 7.3 Manual QA Checklist

- [ ] Share link copies correctly to clipboard
- [ ] WhatsApp share button opens with pre-filled message
- [ ] Link click saves code for logged-in users
- [ ] Link click redirects to registration for new users
- [ ] Registration pre-fills restaurant context
- [ ] Saved codes display correctly in dashboard
- [ ] Staff can verify customer code
- [ ] First-visit detection works correctly
- [ ] 5% discount applies only on first visit per restaurant
- [ ] Upline rewards distributed correctly
- [ ] Code cannot be reused at same restaurant
- [ ] Error messages are user-friendly
- [ ] QR placeholder shows "Coming Soon" message

---

## 8. Performance Considerations

### 8.1 Database Indexes

**Critical indexes for performance:**
```sql
-- Fast restaurant lookup by slug
CREATE INDEX idx_restaurants_slug ON restaurants(slug);

-- Fast saved code lookup
CREATE INDEX idx_saved_codes_user_restaurant ON saved_referral_codes(user_id, restaurant_id);

-- Fast first-visit check
CREATE INDEX idx_customer_restaurant_history_customer ON customer_restaurant_history(customer_id);

-- Fast referral chain lookup
CREATE INDEX idx_referrals_downline_restaurant ON referrals(downline_id, restaurant_id);
```

### 8.2 Caching Strategy

**Cache restaurant slugs:**
- Store slug → restaurant_id mapping in Redis
- TTL: 24 hours (rarely changes)
- Invalidate on restaurant update

**Cache referral code validity:**
- Store code → user_id mapping in Redis
- TTL: 1 hour
- Reduces database queries on verification

---

## 9. Analytics & Tracking

### 9.1 Events to Track

**Link Sharing:**
- Event: `referral_link_shared`
- Properties: `restaurant_id`, `sharer_user_id`, `share_method` (whatsapp/facebook/copy)

**Link Click:**
- Event: `referral_link_clicked`
- Properties: `restaurant_id`, `referral_code`, `is_logged_in`

**Code Saved:**
- Event: `referral_code_saved`
- Properties: `user_id`, `restaurant_id`, `referral_code`, `upline_user_id`

**Code Used:**
- Event: `referral_code_redeemed`
- Properties: `user_id`, `restaurant_id`, `referral_code`, `transaction_amount`, `is_first_visit`

### 9.2 Key Metrics

**Conversion Funnel:**
1. Link clicks
2. Code saves
3. Restaurant visits
4. Code redemptions

**Targets:**
- Link click → Save: >80%
- Save → Redemption: >40% within 30 days
- Share → Friend signup: >20%

---

## 10. Phase 2 Enhancements

### 10.1 QR Code Generator

**Customer Portal:**
- Generate QR code encoding referral link
- Download as PNG/SVG
- Share QR image on social media

**QR Content:**
```
https://sharesaji.com/join/restaurant-slug/SAJI-ABC123
```

**Implementation:**
- Use `react-qr-code` library
- Add download button (canvas → image)
- Styling options (color, size, logo overlay)

### 10.2 Deep Linking

**Mobile App Support:**
- Detect if mobile app is installed
- Open app directly with restaurant + code context
- Fallback to web if app not installed

**Universal Link Format:**
```
sharesaji://join?restaurant=restaurant-slug&code=SAJI-ABC123
```

### 10.3 Smart Notifications

**Email/Push:**
- "Friend A is waiting for you at [Restaurant]! Use your saved code."
- "Your saved code expires in 3 days. Visit [Restaurant] soon!"
- "You have 3 saved codes ready. Explore new restaurants!"

---

## 11. Security Considerations

### 11.1 Rate Limiting

**Link Clicks:**
- Max 10 unique codes saved per user per hour
- Prevent spam/abuse

**Code Verification:**
- Max 20 verification attempts per staff per hour
- Prevent brute force attacks

### 11.2 Code Validation

**Server-side checks:**
- Restaurant exists and is active
- Code belongs to active customer
- User hasn't already used code at restaurant
- Code format is valid

**Never trust client-side:**
- Always validate on backend before saving
- Sanitize inputs to prevent SQL injection

### 11.3 Referral Chain Integrity

**Transaction atomicity:**
- Wrap referral chain creation + transaction in database transaction
- Rollback if any step fails
- Prevents partial state

---

## 12. Summary

This implementation guide provides a complete blueprint for the restaurant-specific referral sharing system. Key takeaways:

1. **One code, many networks:** Users have a single code but separate upline chains per restaurant
2. **Smart link format:** Restaurant context embedded in URL for proper attribution
3. **Saved codes collection:** Reduces friction between link click and physical visit
4. **Fair cost model:** Each restaurant pays only for their own acquisitions
5. **Scalable architecture:** Supports multi-restaurant expansion in Phase 2

All database schemas, API endpoints, and UI components are documented and ready for implementation.
