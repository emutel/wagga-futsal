import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate a stable UID for each fixture
function uid(fixtureId: string, teamId: string) {
  return `fww-${fixtureId}-${teamId}@footballwagga.com.au`;
}

function icsDate(date: Date) {
  // Format as TZID date string for Australia/Sydney
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = new Date(date.toLocaleString("en-US", { timeZone: "Australia/Sydney" }));
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

function escapeIcs(str: string) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// Fold long lines per RFC 5545
function fold(line: string) {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  chunks.push(line.slice(0, 75));
  let i = 75;
  while (i < line.length) {
    chunks.push(" " + line.slice(i, i + 74));
    i += 74;
  }
  return chunks.join("\r\n");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) return new NextResponse("Team not found", { status: 404 });

  const fixtures = await prisma.fixture.findMany({
    where: {
      OR: [{ homeTeamId: id }, { awayTeamId: id }],
      status: "SCHEDULED",
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      competition: true,
      pitch: { include: { venue: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Football Wagga Wagga//FWW App//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcs(team.name)} Fixtures`,
    "X-WR-TIMEZONE:Australia/Sydney",
    "BEGIN:VTIMEZONE",
    "TZID:Australia/Sydney",
    "BEGIN:STANDARD",
    "DTSTART:19700405T030000",
    "RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU",
    "TZOFFSETFROM:+1100",
    "TZOFFSETTO:+1000",
    "TZNAME:AEST",
    "END:STANDARD",
    "BEGIN:DAYLIGHT",
    "DTSTART:19701004T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU",
    "TZOFFSETFROM:+1000",
    "TZOFFSETTO:+1100",
    "TZNAME:AEDT",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
  ];

  for (const f of fixtures) {
    const isHome = f.homeTeamId === id;
    const opponent = isHome ? f.awayTeam.name : f.homeTeam.name;
    const homeAway = isHome ? "vs" : "@";
    const venue = f.pitch?.venue;
    const pitchName = f.pitch?.name ?? "";
    const venueName = venue?.name ?? "TBC";
    const address = venue?.address ?? venueName;
    const location = pitchName ? `${pitchName}, ${venueName}, ${address}` : `${venueName}, ${address}`;
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

    const start = icsDate(f.scheduledAt);
    // Games are ~50 mins, add a buffer
    const endDate = new Date(f.scheduledAt.getTime() + 60 * 60 * 1000);
    const end = icsDate(endDate);

    const summary = `${team.name} ${homeAway} ${opponent}`;
    const description = [
      `${f.competition.name}`,
      `${team.name} ${homeAway} ${opponent}`,
      ``,
      `📍 ${pitchName ? `${pitchName}, ` : ""}${venueName}`,
      `📫 ${address}`,
      ``,
      `🗺️ Directions: ${mapsUrl}`,
      ``,
      `View on Football Wagga Wagga: https://football-wagga.vercel.app/teams/${id}`,
    ].join("\\n");

    lines.push("BEGIN:VEVENT");
    lines.push(fold(`UID:${uid(f.id, id)}`));
    lines.push(fold(`DTSTART;TZID=Australia/Sydney:${start}`));
    lines.push(fold(`DTEND;TZID=Australia/Sydney:${end}`));
    lines.push(fold(`SUMMARY:${escapeIcs(summary)}`));
    lines.push(fold(`LOCATION:${escapeIcs(location)}`));
    lines.push(fold(`DESCRIPTION:${description}`));
    lines.push("STATUS:CONFIRMED");
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  const ics = lines.join("\r\n");
  const filename = `${team.name.toLowerCase().replace(/\s+/g, "-")}-fixtures-2026.ics`;

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-cache",
    },
  });
}
