# Security Audit Log

## MakanTak — Security Fixes & Hardening

**Document Type:** Security Audit  
**Last Updated:** 2026-06-06

---

## Jun 2026 — Security Hardening

### 1. Gemini API Key Exposure (P0) ✅

**Issue:** `VITE_GEMINI_API_KEY` was bundled into the frontend via Vite's `import.meta.env`, making the Gemini API key publicly visible in the production JS bundle.

**Fix:** Created `receipt-ocr` edge function to proxy Gemini calls server-side. Removed `@google/generative-ai` from frontend dependencies and deleted `VITE_GEMINI_API_KEY` from `.env` / `.env.example`. The key is now stored as a Supabase secret (`GEMINI_API_KEY`), shared with the existing `ai-chat` edge function.

**Files changed:** `supabase/functions/receipt-ocr/index.ts` (new), `frontend/src/lib/geminiOCR.ts`, `frontend/.env`, `frontend/.env.example`, `frontend/package.json`.

### 2. Audit Log INSERT Policy (P1) ✅

**Issue:** `function_insert_audit_logs` policy used `WITH CHECK (true)`, allowing any authenticated user to insert arbitrary rows into `audit_logs` via direct SQL. This could poison the audit trail.

**Fix:** Replaced with `deny_direct_insert_audit_logs` using `WITH CHECK (false)`. All legitimate inserts happen via SECURITY DEFINER functions or service role key (both bypass RLS entirely). Migration: `20260605000001_fix_audit_logs_insert_policy.sql`.

### 3. CORS Wildcard (P1) ✅

**Issue:** All 3 edge functions (`ai-chat`, `receipt-ocr`, `expire-vc`) used `Access-Control-Allow-Origin: *`, allowing any website to make cross-origin requests.

**Fix:** Replaced `*` with a dynamic origin whitelist (`www.makantak.com`, `makantak.com`, `localhost:5173`). The `getCorsHeaders(req)` function checks the request's `Origin` header and only reflects allowed origins. Removed CORS from `expire-vc` entirely since it's a cron job that's never called from browsers.

---

## Mar 2026 — Function Authorization & RLS Policy Fixes

- Added caller identity and role verification to 4 critical SECURITY DEFINER functions.
- Fixed 12 RLS policies referencing invalid `'owner'` role — updated to `'merchant'`.
- Upgraded merchant RLS from single-restaurant to multi-restaurant via `restaurants.merchant_id`.
- Added authorization to `get_dashboard_summary`, `get_top_sharers`, `create_referral_chain`, `check_ai_chat_rate_limit`, `generate_restaurant_referral_code`.
- Migrations: `20260306000003` through `20260306000006`.

## Dec 2025 — Database Hardening

- Fixed `staff_view_customer_ledger` to scope to restaurant only.
- `users_allow_signup` now requires `id = auth.uid()`.
- Added `SET search_path = public, pg_temp` to 19 functions.
- Security warnings reduced from 21 → 2 (remaining require Pro Plan).
