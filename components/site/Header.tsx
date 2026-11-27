"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/rates", label: "Rates" },
  { href: "/why-lumen", label: "Why Lumen" },
  { href: "/faq", label: "FAQ" },
  { href: "/track-loan", label: "Check status" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "bg-ink/85 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={pathname === n.href ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm  transition hover:bg-white/10 hover:text-white ${pathname === n.href ? "bg-white/10 text-white" : "text-white/75"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:18005550199" className="text-sm text-white/70 hover:text-white">1-800-555-0199</a>
          <Link href="/apply" className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white">
            Check my rate
          </Link>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-full text-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 px-5 pb-6 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-3 text-lg text-white/85">
              {n.label}
            </Link>
          ))}
          <Link href="/apply" onClick={() => setOpen(false)} className="mt-3 block rounded-full bg-lime py-3 text-center font-semibold text-ink">
            Check my rate
          </Link>
        </div>
      )}
    </header>
  );
}
