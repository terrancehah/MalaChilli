# Content & Voice Guidelines

## MakanTak - UX Writing Standards

**Document Type:** Content Guidelines  
**Last Updated:** 2025-12-25  
**Status:** Active - All copy should follow these standards

---

## 1. Brand Voice

MakanTak's voice should feel like a helpful friend who knows the local food scene — warm, encouraging, and straightforward.
We speak to a multi-racial Malaysian audience (Malay, Chinese, Indian, and mixed communities)
in a way that feels familiar and inclusive.

### Personality Traits

|Trait|Description|Example|
|-------|-------------|---------|
|**Friendly**|Warm and approachable, like a friend recommending a restaurant|"Welcome back! Ready to share some savings?"|
|**Encouraging**|Motivates users to take action without being pushy|"Share your code to start earning rewards"|
|**Clear**|Simple, jargon-free language that anyone can understand|"You earned RM 1.00" not "1.00 VC credited to your account balance"|
|**Helpful**|Guides users through problems with solutions, not blame|"Check your connection and try again" not "Network error occurred"|
|**Local**|Feels Malaysian — uses familiar terms and cultural context|"RM", "Kopitiam", familiar food references|

### Voice Spectrum

```text
Formal ←――――――――――――――――――――――――――→ Casual
                              ●
                         MakanTak
```

We lean casual but stay professional. Think friendly kopitiam uncle, not corporate bank.

---

## 2. Supported Languages

MakanTak supports three languages to serve Malaysia's multi-racial community:

|Language|Code|Primary Audience|
|----------|------|------------------|
|**English**|`en`|Default, urban users, mixed communities|
|**Bahasa Melayu**|`ms`|Malay-speaking users|
|**中文 (Simplified Chinese)**|`zh`|Chinese-speaking users|

### Translation Principles

|Principle|Description|
|-----------|-------------|
|**Maintain tone**|Translations should feel equally friendly, not stiff or overly formal|
|**Cultural adaptation**|Adapt idioms and expressions to feel natural in each language|
|**Consistent terminology**|Use the same translated terms throughout (see Terminology section)|
|**Test with native speakers**|Ensure translations sound natural, not machine-translated|

---

## 3. Terminology

Use consistent terms across the app to avoid confusion.

### Core Terms

|Concept|English|Bahasa Melayu|中文|
|---------|---------|---------------|------|
|**User**|Customer|Pelanggan|顾客|
|**Business**|Restaurant|Restoran|餐厅|
|**Points**|Virtual Currency (VC)|Mata Wang Maya (VC)|虚拟货币 (VC)|
|**Share link**|Referral Link|Pautan Rujukan|推荐链接|
|**Share code**|Promotion Code|Kod Promosi|促销代码|
|**First-time**|First Visit|Lawatan Pertama|首次光顾|
|**Employee**|Staff|Kakitangan|员工|
|**Location**|Branch|Cawangan|分店|
|**Spend**|Bill Amount|Jumlah Bil|账单金额|

### Abbreviations

|Term|Abbreviation|Usage|
|------|--------------|-------|
|Virtual Currency|VC|Use in UI where space is limited; spell out on first mention|
|Ringgit Malaysia|RM|Always use "RM" prefix for currency (e.g., "RM 10.00")|

### Terms to Avoid

|Avoid|Use Instead|Reason|
|-------|-------------|--------|
|"Points"|"Virtual Currency" or "VC"|Points implies a generic loyalty program|
|"User"|"Customer"|More personal and relevant to restaurant context|
|"Merchant"|"Restaurant"|Clearer for our specific use case|
|"Credits"|"VC Balance"|Consistency with our terminology|
|"Redeem points"|"Use VC" or "Redeem VC"|Matches our currency naming|

---

## 4. Writing Style

### General Rules

|Rule|Example|
|------|---------|
|**Use contractions**|"You're all set" not "You are all set"|
|**Use active voice**|"You earned RM 1.00" not "RM 1.00 was earned"|
|**Be concise**|"Share to earn" not "Share your referral code with friends to earn virtual currency"|
|**Use sentence case**|"Add menu item" not "Add Menu Item" (except proper nouns and titles)|
|**Use numerals**|"5% discount" not "five percent discount"|
|**Include currency symbol**|"RM 10.00" not "10.00" or "10 ringgit"|

### Capitalization

|Element|Style|Example|
|---------|-------|---------|
|**Page titles**|Title Case|"Transaction Details"|
|**Section headings**|Title Case|"How It Works"|
|**Buttons**|Sentence case|"Add menu item"|
|**Labels**|Sentence case|"Bill amount"|
|**Placeholders**|Sentence case|"Enter your email"|
|**Error messages**|Sentence case|"Please enter a valid email"|

### Punctuation

|Rule|Example|
|------|---------|
|**No periods in buttons**|"Save changes" not "Save changes."|
|**No periods in labels**|"Email" not "Email."|
|**Use periods in descriptions**|"Your order has been placed."|
|**Use exclamation sparingly**|Only for celebrations: "Transaction successful!"|

---

## 5. Tone by Context

Adjust tone based on the situation while maintaining the core friendly voice.

### Success Messages

Celebratory and affirming. Make users feel good about their action.

|Context|Example|
|---------|---------|
|**Transaction complete**|"Transaction successful! 🎉"|
|**Item saved**|"Menu item saved"|
|**Profile updated**|"Your profile has been updated"|
|**Referral earned**|"You earned RM 1.00 from a referral!"|

### Error Messages

Calm, helpful, and solution-oriented. Never blame the user.

|Context|Bad Example|Good Example|
|---------|-------------|--------------|
|**Network error**|"Error: Network failure"|"Unable to connect. Check your internet and try again."|
|**Invalid input**|"Invalid email format"|"Please enter a valid email address"|
|**Permission denied**|"Access denied"|"You don't have permission to view this page"|
|**Not found**|"404 Error"|"We couldn't find what you're looking for"|

### Empty States

Encouraging and action-oriented. Guide users to populate the empty state.

|Context|Example|
|---------|---------|
|**No orders**|"No orders yet. Visit a restaurant to get started!"|
|**No referrals**|"Share your code to start earning rewards"|
|**No menu items**|"Start building your menu by adding your first item"|

### Onboarding & Instructions

Clear, step-by-step, and encouraging. Build confidence.

|Context|Example|
|---------|---------|
|**How it works**|"Visit a restaurant → Make a transaction → Share your code → Earn rewards"|
|**First-time guidance**|"Show this QR code to staff when making a transaction"|
|**Feature explanation**|"Each restaurant has its own VC balance. Earn and redeem at the same restaurant."|

### Confirmations & Warnings

Clear about consequences. Use for destructive or irreversible actions.

|Context|Example|
|---------|---------|
|**Delete account**|"This action cannot be undone. You will lose all earned VC and referral history."|
|**Void transaction**|"This will reverse the transaction and deduct VC from all affected users."|
|**Logout**|"Are you sure you want to sign out?"|

---

## 6. Button Labels

Buttons should be action-oriented and concise.

### Primary Actions

|Action|Label|Avoid|
|--------|-------|-------|
|**Submit form**|"Save" or "Save changes"|"Submit", "OK"|
|**Create new**|"Add [item]"|"Create", "New"|
|**Continue flow**|"Continue" or "Next"|"Proceed", "Go"|
|**Confirm action**|"Confirm" or specific action|"Yes", "OK"|
|**Share**|"Share" or "Copy link"|"Distribute"|

### Secondary Actions

|Action|Label|Avoid|
|--------|-------|-------|
|**Cancel**|"Cancel"|"Back", "Close" (unless closing a modal)|
|**Dismiss**|"Close" or "Done"|"Dismiss", "Exit"|
|**Go back**|"Back" or "Go back"|"Return", "Previous"|

### Destructive Actions

|Action|Label|Notes|
|--------|-------|-------|
|**Delete**|"Delete" or "Delete [item]"|Use red/destructive styling|
|**Remove**|"Remove"|For removing from a list|
|**Void**|"Void transaction"|Be specific about what's being voided|
|**Sign out**|"Sign out"|Prefer over "Logout"|

---

## 7. Form Labels & Placeholders

### Labels

Keep labels short and descriptive. Use sentence case.

|Field|Label|Notes|
|-------|-------|-------|
|**Email**|"Email"|Not "Email address"|
|**Password**|"Password"|Not "Enter password"|
|**Name**|"Full name" or "Name"|Be specific if needed|
|**Amount**|"Bill amount"|Include context|
|**Date**|"Birthday" or "Date"|Be specific|

### Placeholders

Placeholders should hint at the expected format, not repeat the label.

|Field|Placeholder|Avoid|
|-------|-------------|-------|
|**Email**|"<you@example.com>"|"Enter your email"|
|**Name**|"John Doe"|"Enter your name"|
|**Search**|"Search by name or category..."|"Search"|
|**Amount**|"0.00"|"Enter amount"|
|**Phone**|"+60 12-345 6789"|"Enter phone number"|

### Helper Text

Use helper text for additional context, not for repeating the label.

```tsx
// Good: Provides useful context
<Label>Item name</Label>
<Input placeholder="e.g., Nasi Lemak Special" />
<p className="text-xs text-muted-foreground">
  Use the exact name as it appears on receipts for better OCR matching
</p>

// Bad: Repeats the label
<Label>Item name</Label>
<Input placeholder="Enter item name" />
<p className="text-xs text-muted-foreground">
  Enter the name of the item
</p>
```

---

## 8. Numbers & Currency

### Currency

|Format|Example|Usage|
|--------|---------|-------|
|**Standard**|RM 10.00|Most contexts|
|**Compact**|RM 10|When space is limited and decimals are .00|
|**With sign**|+RM 1.00 / -RM 1.00|Earnings and deductions|

### Percentages

|Format|Example|Usage|
|--------|---------|-------|
|**Standard**|5%|Discounts, rates|
|**With context**|5% discount|When clarity is needed|

### Dates & Times

|Format|Example|Usage|
|--------|---------|-------|
|**Date**|25 Dec 2025|Transaction dates|
|**Date (short)**|25/12/2025|Tables, compact views|
|**Time**|2:30 PM|Transaction times|
|**Relative**|2 hours ago|Recent activity|

---

## 9. Malaysian Context

### Local Terms

Use familiar Malaysian terms where appropriate:

|Term|Usage|
|------|-------|
|**Kopitiam**|Can reference in marketing/examples|
|**Mamak**|Can reference in marketing/examples|
|**RM**|Always use for currency|
|**IC**|For identification references (if needed)|

### Cultural Sensitivity

|Guideline|Reason|
|-----------|--------|
|**Avoid food-specific imagery in generic contexts**|Malaysia has diverse dietary restrictions (halal, vegetarian, etc.)|
|**Use inclusive language**|Avoid assumptions about race, religion, or dietary preferences|
|**Respect multilingual users**|Don't assume English proficiency; provide clear translations|

---

## Quick Reference

|Context|Tone|Example|
|---------|------|---------|
|**Success**|Celebratory|"Transaction successful!"|
|**Error**|Helpful, calm|"Check your connection and try again"|
|**Empty state**|Encouraging|"Share your code to start earning"|
|**Confirmation**|Clear, serious|"This action cannot be undone"|
|**Instruction**|Guiding|"Show this QR code to staff"|
|**Button**|Action-oriented|"Save changes", "Add item"|
