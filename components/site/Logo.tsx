import Link from "next/link";

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Lumen home">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-lime text-ink shadow-[0_0_0_4px_rgb(200_241_105/0.15)] transition group-hover:rotate-6">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M5 19V5" />
          <path d="M5 19h14" />
          <path d="M9 15l4-4 2 2 4-5" />
        </svg>
      </span>
      <span className={`font-display text-2xl font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        lumen<span className="text-lime">.</span>
      </span>
    </Link>
  );
}
