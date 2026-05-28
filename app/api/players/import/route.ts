import { NextResponse } from "next/server";
import { parse } from "papaparse";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
// Expected CSV columns (PlayFootball export):
// FirstName, LastName, DateOfBirth, Gender, PlayFootballID
// Column names are case-insensitive and flexible

function normaliseRow(row: Record<string, string>) {
  const keys = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.toLowerCase().replace(/[\s_-]/g, ""), v])
  );
  return {
    firstName: keys["firstname"] || keys["first_name"] || keys["first"],
    lastName: keys["lastname"] || keys["last_name"] || keys["last"] || keys["surname"],
    dateOfBirth: keys["dateofbirth"] || keys["dob"] || keys["birthdate"],
    gender: keys["gender"] || keys["sex"],
    playFootballId: keys["playfootballid"] || keys["playerid"] || keys["id"] || null,
  };
}

function parseGender(raw: string): "MALE" | "FEMALE" | "MIXED" {
  const g = raw?.toLowerCase().trim();
  if (g === "female" || g === "f") return "FEMALE";
  if (g === "male" || g === "m") return "MALE";
  return "MIXED";
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const text = await file.text();
  const { data, errors } = parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    return NextResponse.json({ error: "CSV parse error", details: errors }, { status: 400 });
  }

  let imported = 0;
  let skipped = 0;
  const parseErrors: string[] = [];

  for (const raw of data) {
    const row = normaliseRow(raw);

    if (!row.firstName || !row.lastName || !row.dateOfBirth) {
      parseErrors.push(`Skipped row: missing required fields — ${JSON.stringify(raw)}`);
      skipped++;
      continue;
    }

    const dob = new Date(row.dateOfBirth);
    if (isNaN(dob.getTime())) {
      parseErrors.push(`Skipped ${row.firstName} ${row.lastName}: invalid date "${row.dateOfBirth}"`);
      skipped++;
      continue;
    }

    // Upsert by playFootballId if available, otherwise by name+DOB
    if (row.playFootballId) {
      await prisma.player.upsert({
        where: { playFootballId: row.playFootballId },
        update: {
          firstName: row.firstName,
          lastName: row.lastName,
          dateOfBirth: dob,
          gender: parseGender(row.gender ?? ""),
        },
        create: {
          firstName: row.firstName,
          lastName: row.lastName,
          dateOfBirth: dob,
          gender: parseGender(row.gender ?? ""),
          playFootballId: row.playFootballId,
        },
      });
    } else {
      const existing = await prisma.player.findFirst({
        where: {
          firstName: row.firstName,
          lastName: row.lastName,
          dateOfBirth: dob,
        },
      });
      if (!existing) {
        await prisma.player.create({
          data: {
            firstName: row.firstName,
            lastName: row.lastName,
            dateOfBirth: dob,
            gender: parseGender(row.gender ?? ""),
          },
        });
      } else {
        skipped++;
        continue;
      }
    }

    imported++;
  }

  return NextResponse.json({ imported, skipped, errors: parseErrors });
}
