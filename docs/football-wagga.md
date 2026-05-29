# Football Wagga — Client Setup

**Organisation:** Football Wagga (FWW)
**Website:** https://www.footballwagga.com.au
**Platform scope:** Miniroos 2026 competition management + holiday clinics / paid sessions
**Primary contact:** Liam Dedini (Development Officer) — development@footballwagga.com.au — 0434 006 361

---

## Contacts

| Role | Name | Email |
|---|---|---|
| Development Officer (primary) | Liam Dedini | development@footballwagga.com.au |
| President | Andrew Manton | president@footballwagga.com.au |
| Secretary / MPIO | Deonie Burns | secretary@footballwagga.com.au |
| Treasurer | Justin Curran | treasurer@footballwagga.com.au |
| Operations | Allan Tsang | operations@footballwagga.com.au |
| Marketing & Media | Brooke Gayler | media@footballwagga.com.au |
| Female Development | Stacey Collins | femaledevelopment@footballwagga.com.au |
| Referees | — | refs@footballwagga.com.au |

**Mailing address:** PO Box 2264, Wagga Wagga NSW 2650

---

## What this instance needs

| Feature | Status | Notes |
|---|---|---|
| Competition management | ✅ Core need | 18 Miniroos age groups, Saturdays |
| Fixtures & draws | ⚠️ Partial | Draw PDFs exist but behind Google auth |
| Live scoring | Optional | Miniroos U5–U10 not officially scored |
| Standings | Optional | Non-competitive for youngest groups |
| Player management | ✅ | Registration via PlayFootball |
| Referee management | Enable, don't configure | Used for senior comps in future |
| Official payroll | Not now | Senior comp future use |
| Paid sessions | ✅ Core need | Holiday clinics replacing Square |
| Rules document | ✅ | Seeded with Miniroos framework |
| Sponsors | Later | Set up once confirmed with Liam |

---

## Competitions — Miniroos 2026

All matches played **Saturday** at Bolton Park or Duke of Kent Park.

> **Note:** Specific field assignments per age group are documented in draw PDFs on the FWW website. The seed script uses placeholder fields — update `CompetitionTimeSlot.pitchId` for each competition once PDFs are accessed.

| Competition | AgeGroup | Gender | Kick-off | Draw PDF |
|---|---|---|---|---|
| U5 Black | U5 | Male | 1:15 pm | [Drive](https://drive.google.com/file/d/1lo347toC13bRZWP-zqngEAS76YKtj1y2/view) |
| U6 Black | U6 | Male | 9:15 am | [Drive](https://drive.google.com/file/d/11-817WZ-LjUjmo8oO1RjgysEO5LmT8DD/view) |
| U6 White | U6 | Male | 10:15 am | [Drive](https://drive.google.com/file/d/1KOIhO6Nbf2u_GyLVHCrBeaTE4hLoPtFY/view) |
| U5/6 Girls | U6 | Female | 1:15 pm | [Drive](https://drive.google.com/file/d/1lhRsAcQIhfZIllWTLtzywUwsZzPUTWGt/view) |
| U7 Black | U7 | Male | 11:15 am | [Drive](https://drive.google.com/file/d/1qF0k_LKvmQHG6LkqA-G6EjbHSWDIGuCa/view) |
| U7 White | U7 | Male | 12:15 pm | [Drive](https://drive.google.com/file/d/1XJpIhNMsUuoIMa0lmXibjblf1O2-SiaE/view) |
| U8 Black | U8 | Male | 11:15 am | [Drive](https://drive.google.com/file/d/17wYbkK0UFNMakkgyKZk0n7meX35_56zd/view) |
| U8 White | U8 | Male | 12:15 pm | [Drive](https://drive.google.com/file/d/1Vrsi1AvT_Xg4QZ0WUxzhIq9HXsSIK1-Y/view) |
| U7/8 Girls | U8 | Female | 1:15 pm | [Drive](https://drive.google.com/file/d/1zqa3zZTJhIytM-P3QfKXqieGIhjmVdAW/view) |
| U9 Black | U9 | Male | 9:15 am | [Drive](https://drive.google.com/file/d/1CXHyL7sFjeLcei_yZLQGlTE3zLfXRDWg/view) |
| U9 White | U9 | Male | 10:15 am | [Drive](https://drive.google.com/file/d/1QlBSuwni0UfxP-Gb-aHOm0qc3TF53YzN/view) |
| U10 Black | U10 | Male | 9:15 am | [Drive](https://drive.google.com/file/d/1wPpc9oIbKWG7zpX3-XPPxB5-Rre4p563/view) |
| U10 White | U10 | Male | 10:15 am | [Drive](https://drive.google.com/file/d/12nrA0VwXasU0MtTYfhic-Dpn-sTUcFhc/view) |
| U9/10 Girls | U10 | Female | 8:15 am | [Drive](https://drive.google.com/file/d/1P8UO7LojD8Y0EN7b4wrbHqs4xCDuUxvV/view) |
| U11-12 Black ⚑ | U12 | Male | 11:15 am | DRIBL |
| U11-12 Grey ⚑ | U12 | Male | 1:15 pm | DRIBL |
| U11-12 White ⚑ | U12 | Male | 12:15 pm | DRIBL |
| U11-12 Girls ⚑ | U12 | Female | 1:15 pm | DRIBL |

⚑ U11-12 competitions are currently managed in DRIBL. Competition structure is seeded — add teams and fixtures when ready to migrate.

---

## Venues

| Venue | Address | Fields seeded | Map |
|---|---|---|---|
| Bolton Park | Cnr Bourke & Tompson Streets, Wagga Wagga | 5 (Field 1–5) | [Drive](https://drive.google.com/file/d/1XjScBCagOG6-pL5NNG36NrI/view) |
| Duke of Kent Park | Duke of Kent Drive, Wagga Wagga | 4 (Field 1–4) | [Drive](https://drive.google.com/file/d/1oMA0ybg2J2i0XdfmoVFF0tvUznrUXDTY/view) |

Field names need to be updated once the draw PDFs are accessed — the PDFs show which specific field each age group is assigned to.

---

## Holiday Clinics (Paid Sessions)

Football Wagga currently sells holiday clinics through Square. This instance replaces Square for that purpose.

Two sample sessions are seeded (July and October 2026 school holidays). Update dates, prices, and descriptions with Liam before going live. The Stripe setup follows the standard flow in the main setup guide.

**SMTP / booking emails:** Set `SMTP_FROM` to something like `noreply@footballwagga.com.au` and ensure Liam receives booking confirmations at `development@footballwagga.com.au`.

---

## Referee Module

Referees are **not required for Miniroos** (U5–U10 are parent/coach-managed; U11-12 have accredited refs assigned separately via refs@footballwagga.com.au). However, FWW wants referee management for their **senior competitions** (currently in DRIBL, with significant payment issues).

- Keep the referee module visible in admin
- Do not configure payroll yet — revisit when senior comps move to this platform
- When senior comps are added, the ABA payroll feature will replace DRIBL's payment process

---

## Branding

Colours need to be confirmed with Liam. Football Wagga's website uses a Google Sites template that doesn't expose its CSS, so check the logo/kit assets directly.

**Action for Liam:** Provide primary brand hex colour and the logo file (PNG, transparent background). The logo appears in the admin sidebar and public nav.

Placeholder — update `app/globals.css` once confirmed:

```css
/* Football Wagga — confirm colours with Liam Dedini */
--color-brand:       #2E7D32;   /* placeholder green */
--color-brand-dark:  #1B5E20;
--color-brand-light: #66BB6A;

--color-navy:        #0D1B2E;   /* keep dark or confirm FWW dark colour */
--color-navy-mid:    #1A2E4A;
--color-navy-light:  #243B55;
```

---

## Setup Checklist

Follow `docs/new-client-setup.md` for the full walkthrough. Football Wagga specific notes:

```
[ ] 1. Fork/duplicate wagga-futsal repo → new repo: emutel/football-wagga
[ ] 2. Apply FWW branding (colours, logo — confirm with Liam)
[ ] 3. Update org name throughout (search "FOOTBALL WAGGA" → "Football Wagga")
[ ] 4. Provision Railway database — new project for FWW
[ ] 5. Set Vercel env vars (DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_APP_URL)
[ ] 6. Set Stripe keys (for holiday clinics)
[ ] 7. Set SMTP vars (booking confirmation emails)
[ ] 8. Deploy to Vercel
[ ] 9. Run seed: npx tsx prisma/seed-football-wagga.ts
[  ]    → Creates venues, 18 competitions, admin user, 2 clinic sessions
[ ] 10. First login → development@footballwagga.com.au / ChangeMe123!
[ ] 11. Change admin password immediately
[ ] 12. Open draw PDFs → add teams to each competition
[ ] 13. Correct field assignments for each competition time slot
[ ] 14. Enter or generate fixtures per age group from PDF draws
[ ] 15. Update clinic session dates/prices to match FWW's actual schedule
[ ] 16. Add sponsors (confirm with Liam)
[ ] 17. Configure Stripe webhook
[ ] 18. Custom domain (confirm domain with Liam — footballwagga.com.au or subdomain)
[ ] 19. Demo walkthrough with Liam and team
[ ] 20. Note U11-12 DRIBL migration as a separate project
```

---

## Fixture Data Status

The 2026 draw PDFs are hosted on Google Drive (links in the competition table above) and require a Google account to open. Once accessed:

1. Each PDF contains the full round-by-round draw: teams, dates, field assignments
2. Enter teams via **Admin → Teams** (or bulk CSV import)
3. Assign teams to competitions via **Admin → Competitions → [Competition] → Teams**
4. Enter fixtures manually or generate round-robin via **Admin → Fixtures → Generate Draw**

If you can export the PDF data to CSV, the bulk import path will be faster. Alternatively, share the PDFs with us and we can convert them to seed data.

---

## Naming change from FOOTBALL WAGGA template

When the repo is forked, do a global search-replace across `.tsx` and `.ts` files:

| Old | New |
|---|---|
| `FOOTBALL WAGGA` | `Football Wagga` |
| `FOOTBALL WAGGA` | `FOOTBALL WAGGA` |
| `footballwagga.com.au` | `footballwagga.com.au` (or chosen domain) |
| `development@footballwagga.com.au` | `development@footballwagga.com.au` |

Key files per the setup guide: `app/(admin)/layout.tsx`, `app/(public)/layout.tsx`, `app/(public)/page.tsx`, `app/layout.tsx`.
