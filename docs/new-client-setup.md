# New Client Setup Guide

This codebase is the EmuSport competition management platform. It covers everything a futsal (or small-sided football) association needs to run their competition in-house — registrations, fixtures, live scoring, referee management, payroll, and paid public sessions.

This guide walks through spinning up a new instance for a new client from scratch.

---

## What's Included

| Feature | Description |
|---|---|
| **Competition management** | Multiple competitions, age groups, seasons. Automatic draw, finals bracket. |
| **Live scoring** | Referee portal with real-time match events (goals, cards, fouls). Public live view. |
| **Standings & results** | Auto-calculated ladder, match history, team pages. |
| **Player management** | Registration, bulk CSV import, suspension tracking. |
| **Referee management** | Accounts, bank details, game fee rate card, ABA payroll download. |
| **Paid sessions** | Stripe-powered public booking for casual/social sessions. |
| **Rules document** | Admin-managed Markdown with PDF export. Public accordion viewer. |
| **Sponsors** | Tiered sponsor management (Platinum → Bronze) with logos. |
| **Admin portal** | Full back-office at `/admin` — competitions, teams, fixtures, payroll, sponsors. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS variables for theming) |
| Database | PostgreSQL via Prisma v7 |
| Database host | Railway |
| App host | Vercel |
| Payments | Stripe (sessions booking, webhooks) |
| Auth | Custom token-based (bcrypt + DB sessions, 30-day expiry) |
| Email | Nodemailer (booking confirmations) |

---

## Checklist Overview

```
[ ] 1. Fork / duplicate the repo
[ ] 2. Apply client branding (colours, logo, name)
[ ] 3. Provision Railway database
[ ] 4. Set Vercel environment variables
[ ] 5. Deploy to Vercel (preview or production)
[ ] 6. Seed the first admin user
[ ] 7. Set up Stripe (if sessions are needed)
[ ] 8. Configure Stripe webhook
[ ] 9. First login — create venue, pitches, competition
```

---

## Step 1 — Fork / Duplicate the Repo

Create a new private GitHub repo for the client. Do **not** fork publicly — use GitHub's "Import repository" or duplicate:

```bash
# Clone the template
git clone https://github.com/emutel/wagga-futsal.git acme-futsal
cd acme-futsal

# Point to the new client repo
git remote set-url origin https://github.com/emutel/acme-futsal.git
git push -u origin main
```

---

## Step 2 — Apply Client Branding

All branding lives in two places. No Tailwind config changes needed.

### 2a. Colours — `app/globals.css`

Find the `:root` block at the top of the file. Replace the brand and navy values:

```css
:root {
  /* ✏️  Primary action colour — buttons, links, accents */
  --color-brand:       #E91E8C;   /* e.g. change to client's main colour */
  --color-brand-dark:  #C0166F;   /* ~15% darker — hover states */
  --color-brand-light: #F472B6;   /* ~20% lighter — subtle fills */

  /* ✏️  Dark background / text colour */
  --color-navy:        #0D1B2E;   /* e.g. change to client's dark colour */
  --color-navy-mid:    #1A2E4A;
  --color-navy-light:  #243B55;

  /* Leave these unless the client has specific requirements */
  --color-background: #ffffff;
  --color-foreground: #0D1B2E;
  --color-muted:      #6B7280;
  --color-border:     #E5E7EB;
  --color-live:       #10B981;
  --color-live-bg:    #D1FAE5;
}
```

**Tip:** Use a tool like [oklch.com](https://oklch.com) or [coolors.co](https://coolors.co) to generate the dark/light variants from the client's primary hex.

### 2b. Logo — `public/logo.png`

Replace `public/logo.png` with the client's logo. The logo is used in:
- Admin sidebar (36×36px — keep it square or circular)
- Public header (displayed at ~32px height)

PNG with a transparent background works best. If it's a light logo on dark background, also check the public header — it uses `bg-navy` so it will show correctly.

### 2c. Organisation Name

The organisation name is referenced in a few places. Search the codebase for `"WAGGA FUTSAL"` and `"Wagga Futsal"` and replace:

```bash
# Find all occurrences
grep -r "Wagga Futsal\|WAGGA FUTSAL" --include="*.tsx" --include="*.ts" .
```

Key files to update:
- `app/(admin)/layout.tsx` — sidebar header ("WAGGA FUTSAL" + "Admin")
- `app/(public)/layout.tsx` — public nav bar
- `app/(public)/page.tsx` — homepage hero text
- `app/layout.tsx` — default `<title>` metadata
- `lib/aba.ts` — default ABA file description (if using payroll)

---

## Step 3 — Provision Railway Database

Each client gets their own isolated Railway project and PostgreSQL database.

1. Go to [railway.app](https://railway.app) → **New Project**
2. Add a **PostgreSQL** service
3. Click the database → **Variables** tab → copy `DATABASE_URL`
4. In your local `.env` (create from `.env.example`), set:
   ```
   DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/railway
   ```
5. Push the schema to the new database:
   ```bash
   npx prisma db push
   ```
   This creates all tables. No migrations needed — `db push` is safe for new projects.

---

## Step 4 — Vercel Environment Variables

In the Vercel dashboard for the new project, add these under **Settings → Environment Variables**:

| Variable | Where to get it | Required |
|---|---|---|
| `DATABASE_URL` | Railway → PostgreSQL → Variables | ✅ |
| `AUTH_SECRET` | Generate: `openssl rand -hex 32` | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your Vercel preview URL or custom domain | ✅ |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys | Sessions only |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys | Sessions only |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks (step 8) | Sessions only |
| `SMTP_HOST` | Email provider | Booking emails only |
| `SMTP_PORT` | Email provider | Booking emails only |
| `SMTP_USER` | Email provider | Booking emails only |
| `SMTP_PASS` | Email provider | Booking emails only |
| `SMTP_FROM` | e.g. `noreply@acmefutsal.com.au` | Booking emails only |

Apply all variables to **Production**, **Preview**, and **Development** environments.

---

## Step 5 — Deploy to Vercel

```bash
# Link the repo to a new Vercel project
npx vercel --yes

# Or push to GitHub and connect via Vercel dashboard
git push origin main
```

Vercel auto-detects Next.js. Build command is `npm run build` (which runs `prisma generate && next build`).

For a **preview** (showing a client before they commit): use Vercel's preview URL — it's live immediately after deploy, no custom domain needed.

---

## Step 6 — Seed the First Admin User

There's no admin signup UI (by design). Create the first admin via a one-off script:

```bash
# Set the target database
$env:DATABASE_URL = "postgresql://..."   # PowerShell
# export DATABASE_URL="postgresql://..."   # bash

npx tsx prisma/seed-admin.ts
```

If that script doesn't exist yet, run this directly:

```bash
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash('ChangeMe123!', 12);
  await prisma.user.create({
    data: { name: 'Admin', email: 'admin@acmefutsal.com.au', passwordHash: hash, role: 'ADMIN' }
  });
  console.log('Admin created');
}
main().finally(() => prisma.\$disconnect());
"
```

Then log in at `/referee/login` with those credentials. The admin portal is at `/admin`.

**Change the password immediately** via the database or by adding a change-password flow.

---

## Step 7 — Set Up Stripe (Sessions Only)

Skip this step if the client doesn't use paid casual sessions.

1. Create or use an existing Stripe account
2. In **Stripe Dashboard → Products**, create a product for the session type (or let the app create payment intents dynamically — it already does this)
3. Copy the API keys into Vercel env vars (step 4)
4. Use **test mode keys** for the preview, switch to **live keys** before go-live

---

## Step 8 — Configure Stripe Webhook

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
3. Events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the **Signing secret** → set as `STRIPE_WEBHOOK_SECRET` in Vercel

---

## Step 9 — First Login Walkthrough

Once deployed, walk the client through (or do it yourself for a preview):

1. **Admin → Competitions → New** — create a competition (name, season, age group, gender)
2. **Admin → Sessions** (under competition) — add time slots (day, time, pitch, duration)
3. **Admin → Teams** — add teams or let them self-register
4. **Admin → Fixtures → Generate Draw** — auto-generates round-robin fixtures
5. **Admin → Referees** — add referee accounts
6. **Admin → Payroll** — set game fee rate card (field ref / scorer)
7. **Admin → Rules** — paste the competition rules (Markdown supported)
8. **Admin → Sponsors** — add sponsor logos and tier

---

## Branding Quick Reference

| Thing to change | File | What to edit |
|---|---|---|
| Brand colour | `app/globals.css` | `--color-brand` and variants |
| Dark colour | `app/globals.css` | `--color-navy` and variants |
| Logo | `public/logo.png` | Replace file (keep square PNG) |
| Org name (admin) | `app/(admin)/layout.tsx` | Hardcoded in sidebar |
| Org name (public) | `app/(public)/layout.tsx` | Hardcoded in nav |
| Homepage hero | `app/(public)/page.tsx` | Headline + subtext |
| Page title prefix | `app/layout.tsx` | `metadata.title.template` |
| ABA org name | Admin → Payroll | Set in the payroll form (persisted to DB) |

---

## Common Issues

**Build fails on Vercel**
- Check `DATABASE_URL` is set in all environments
- Run `npx prisma generate` locally to catch schema errors before pushing

**"Unauthorized" on admin pages**
- Session cookie not set — log in again
- Check `AUTH_SECRET` is set in Vercel env vars

**Sessions not showing on public site**
- Status must be `OPEN` or `FULL`
- `scheduledAt` must be in the future (or within 3 hours of now for in-progress)

**Stripe payments not confirming**
- Webhook not configured, or `STRIPE_WEBHOOK_SECRET` is wrong
- Check Vercel logs at `/api/webhooks/stripe`

**Referee can't log in**
- Their account must have `role: REFEREE` — created via Admin → Referees

---

## Per-Client Effort Estimate

| Scope | Time |
|---|---|
| Branding only (colours + logo + name) | ~30 min |
| Full setup (DB + Vercel + Stripe + seed) | ~2 hours |
| Initial data entry (competitions, teams, fixtures) | 1–2 hours (varies) |
| Custom domain + DNS | 15 min |
