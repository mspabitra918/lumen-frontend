"use client";

import { useMemo, useState } from "react";
import type { FaqGroup } from "../../lib/content";

export function FaqExplorer({ groups }: { groups: FaqGroup[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => cat === "all" || g.key === cat)
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (f) =>
            !q ||
            f.q.toLowerCase().includes(q) ||
            f.a.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length);
  }, [groups, query, cat]);

  return (
    <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <label className="relative block">
          <span className="sr-only">Search questions</span>
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink/40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="w-full rounded-full border border-ink/15 bg-white py-3 pr-4 pl-11 text-sm outline-none focus:border-moss focus:ring-4 focus:ring-lime/40"
          />
        </label>
        <nav
          className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"
          aria-label="FAQ categories"
        >
          {[{ key: "all", label: "All questions" }, ...groups].map((g) => (
            <button
              key={g.key}
              type="button"
              aria-pressed={cat === g.key}
              onClick={() => setCat(g.key)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-left text-sm font-medium transition lg:rounded-xl ${
                cat === g.key
                  ? "bg-ink text-lime"
                  : "text-ink/65 hover:bg-cream"
              }`}
            >
              {g.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="space-y-14">
        {shown.length === 0 && (
          <div className="rounded-3xl bg-cream p-10 text-center">
            <p className="font-display text-2xl">No matches for “{query}”.</p>
            <p className="mt-2 text-ink/55">
              Try another word, or call us at 1-800-555-0199.
            </p>
          </div>
        )}
        {shown.map((g) => (
          <section key={g.key}>
            <h2 className="font-display text-3xl font-medium">{g.label}</h2>
            <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
              {g.items.map((f) => (
                <details key={f.q} className="group py-6" open={!!query.trim()}>
                  <summary className="flex cursor-pointer items-center justify-between gap-6 text-lg font-semibold">
                    {f.q}
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream transition group-open:rotate-45 group-open:bg-lime">
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M10 4v12M4 10h12" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink/60">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
