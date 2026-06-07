# Public API v1

Read-only JSON API that powers the mobile app (and any future web/PWA). It exposes
**only non-personal competition data** — team names, fixtures, scores, and the ladder.
No contact details, no dates of birth, no player PII.

> **Longevity contract.** The mobile app codes against the *shapes* documented here, not
> against the database. This API is a stable boundary: the current backend is Next.js + Prisma,
> but it could later be Directus or anything else. As long as a backend returns these shapes at
> these paths, the app keeps working with **no rebuild**. Treat breaking changes as a new
> version (`/api/public/v2/...`), never a mutation of v1.

## Conventions

- Base path: `/api/public/v1`
- All responses `application/json`.
- CORS open (`Access-Control-Allow-Origin: *`) — safe, the data is public.
- Cached at the edge ~60s (`Cache-Control: public, s-maxage=60, stale-while-revalidate=300`).
- Timestamps are ISO 8601 UTC strings; clients localise (app uses Australia/Sydney).
- Enum strings are passed through verbatim (see below); clients map to labels.

## Endpoints

### `GET /competitions`
Publicly visible competitions (excludes `REGISTRATION` drafts).

```json
{
  "competitions": [
    { "id": "clx...", "name": "Monday Mixed", "season": "Winter 2026",
      "ageGroup": "OPENS", "gender": "MIXED", "status": "ACTIVE" }
  ]
}
```

### `GET /competitions/{id}/fixtures`
Upcoming and in-progress fixtures, soonest first. Includes games kicked off within the last 3h.

```json
{
  "fixtures": [
    { "id": "clx...", "round": 4, "scheduledAt": "2026-06-08T09:00:00.000Z",
      "status": "SCHEDULED", "phase": "REGULAR",
      "homeTeam": { "id": "t1", "name": "Thunder" },
      "awayTeam": { "id": "t2", "name": "Capital City FC" },
      "venue": "Court 1" }
  ]
}
```

### `GET /competitions/{id}/results`
Finished fixtures with scores, most recent first.

```json
{
  "results": [
    { "id": "clx...", "round": 3, "scheduledAt": "2026-06-01T09:00:00.000Z",
      "status": "COMPLETED", "phase": "REGULAR",
      "homeScore": 3, "awayScore": 2,
      "homeTeam": { "id": "t1", "name": "Thunder" },
      "awayTeam": { "id": "t2", "name": "Capital City FC" },
      "venue": "Court 1" }
  ]
}
```

### `GET /competitions/{id}/standings`
The ladder, ordered points → goal difference → goals for.

```json
{
  "standings": [
    { "teamId": "t1", "teamName": "Thunder", "played": 3, "won": 3,
      "drawn": 0, "lost": 0, "goalsFor": 12, "goalsAgainst": 4,
      "goalDifference": 8, "points": 9 }
  ]
}
```

## Enum reference

| Field | Values |
|---|---|
| competition `status` | `ACTIVE`, `FINALS`, `COMPLETED` (public); `REGISTRATION` is hidden |
| fixture `status` | `SCHEDULED`, `LIVE`, `COMPLETED`, `FORFEITED_HOME`, `FORFEITED_AWAY`, `ABANDONED` |
| fixture `phase` | `REGULAR`, `SEMI_FINAL`, `THIRD_PLACE`, `GRAND_FINAL` |
| `gender` | `MIXED`, `MALE`, `FEMALE` |

## Implementation notes

- Routes live under `app/api/public/v1/` and use the `publicJson()` / `publicOptions()`
  helpers in `lib/publicApi.ts`, which also export the TypeScript interfaces for each shape.
- Standings reuse `lib/standings.ts` (single source of truth for ladder maths).
- Every route is `export const dynamic = "force-dynamic"` (fresh DB read) and relies on the
  `Cache-Control` header for CDN caching — do **not** add `export const revalidate`, it conflicts.
