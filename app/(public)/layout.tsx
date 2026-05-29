"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/competition", label: "Competitions" },
  { href: "/sessions", label: "Book a Session" },
  { href: "/rules", label: "Rules" },
  { href: "/gallery", label: "Gallery" },
  { href: "/sponsors", label: "Sponsors" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-navy text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="FOOTBALL WAGGA WAGGA" width={44} height={44} className="rounded" priority />
            <span className="text-white font-black text-lg tracking-tight hidden sm:block">FOOTBALL WAGGA WAGGA</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/80 hover:text-brand transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/referee/login"
              className="text-xs bg-brand hover:bg-brand-dark text-white px-3 py-1.5 rounded font-semibold transition-colors"
            >
              Referee Login
            </Link>
            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-navy-mid border-t border-white/10 px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-white/80 hover:text-brand transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-navy text-white/60 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image src="/logo.png" alt="FOOTBALL WAGGA WAGGA" width={64} height={64} className="rounded mb-2" />
            <p className="text-sm">Wagga Wagga&apos;s premier football association — Est. 2012.</p>
            <p className="text-sm mt-1">
              Venues: EQUEX Multi Purpose Sports Centre &amp; Bolton Park Stadium
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-2">Quick Links</p>
            <ul className="space-y-1 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-2">Registration</p>
            <p className="text-sm mb-3">
              Player registration is managed through PlayFootball (Football NSW).
            </p>
            <a
              href="https://playfootball.com.au/football-finder?st=location&lat=-35.1053&lng=147.3605&suburb=Wagga+Wagga&state_code=NSW&postcode=2650&clubId=75505"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand hover:bg-brand-dark text-white text-sm px-4 py-2 rounded font-semibold transition-colors"
            >
              Register on PlayFootball
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 text-center py-4 text-xs">
          © {new Date().getFullYear()} FOOTBALL WAGGA WAGGA Pty Ltd. All rights reserved.
        </div>
      </footer>
    </>
  );
}
