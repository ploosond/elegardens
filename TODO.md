# TODO - Elegardens Setup & Deployment

## Production: Verify Resend Domain

**Why:** Currently using Resend's testing sandbox (`onboarding@resend.dev`). To send emails to any address and enable user confirmations, verify your domain.

**Steps:**

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter `elegardens.com`
4. Add DNS records to your domain registrar:
   - SPF record
   - DKIM records
   - DMARC (optional but recommended)
5. Click "Verify" in Resend (usually takes 5-15 minutes)
6. Once verified, update `.env`:
   ```env
   RESEND_FROM_EMAIL="noreply@elegardens.com"
   CONTACT_FORM_SEND_CONFIRMATION=true
   ```
7. Redeploy to production

**Current Status:**

- ❌ Domain not verified
- ⚠️ `CONTACT_FORM_SEND_CONFIRMATION=false` (disabled for now)
- ⚠️ `RESEND_FROM_EMAIL="onboarding@resend.dev"` (testing sandbox)

**After verification:**

- ✅ Enable user confirmations
- ✅ Send emails from your domain
- ✅ Professional email branding

---

## Other Tasks

- [ ] Email testing (all scenarios)
- [ ] Database seeding in dev
- [ ] Export content to prod
- [ ] Production deployment
