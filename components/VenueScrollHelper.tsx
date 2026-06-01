"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const VENUE_IDS: [string, string][] = [
  ["bolton", "bolton-park"],
  ["duke", "duke-of-kent"],
  ["burns", "burns-park"],
  ["bull", "bull-paddock"],
];

export default function VenueScrollHelper() {
  const params = useSearchParams();
  const venue = params.get("venue")?.toLowerCase() ?? "";

  useEffect(() => {
    if (!venue) return;
    const match = VENUE_IDS.find(([key]) => venue.includes(key));
    if (!match) return;
    const el = document.getElementById(match[1]);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [venue]);

  return null;
}
