import { NextResponse } from "next/server";

/**
 * Standard response for the public read-only API (v1).
 *
 * - CORS open: these endpoints expose only non-personal competition data
 *   (team names, scores, fixtures) and are safe to read from any origin
 *   (mobile app, future web/PWA).
 * - CDN-cached via Cache-Control: the route renders dynamically (fresh DB read)
 *   but the response is cached at the edge for `maxAge` seconds, with
 *   stale-while-revalidate so clients never wait on a cold query.
 *
 * Keep this layer stable. The mobile app codes against the JSON SHAPES returned
 * here, not against Prisma. If the backend ever changes (e.g. Directus), make the
 * new backend match these shapes and the app needs no rebuild.
 */
export function publicJson(data: unknown, maxAge = 60) {
  return NextResponse.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=300`,
    },
  });
}

/** Preflight handler for the public API. */
export function publicOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// ---- API v1 response shapes (the contract the mobile app depends on) ----

export interface ApiCompetition {
  id: string;
  name: string;
  season: string;
  ageGroup: string;
  gender: string;
  status: string;
}

export interface ApiTeamRef {
  id: string;
  name: string;
}

export interface ApiFixture {
  id: string;
  round: number;
  scheduledAt: string; // ISO 8601 UTC
  status: string;
  phase: string;
  homeTeam: ApiTeamRef;
  awayTeam: ApiTeamRef;
  venue: string | null;
}

export interface ApiResult extends ApiFixture {
  homeScore: number;
  awayScore: number;
}

export interface ApiStandingRow {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
