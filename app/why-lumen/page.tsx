import type { Metadata } from "next";
import { Shell, CheckIcon } from "@/lumen-frontend/components/site/Shell";
import { PageHero } from "@/lumen-frontend/components/site/PageHero";
import { CtaBand } from "@/lumen-frontend/components/site/CtaBand";

export const metadata: Metadata = {
  title: "Why Lumen",
  description:
    "Personal loans built on transparency, fair terms and real support.",
};

const VALUES = [
  {
    t: "Clarity over cleverness",
    d: "APR, payment, number of payments and total cost go side by side on every offer. No teaser rates, no buried terms.",
    icon: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z",
  },
  {
    t: "Loans that fit a budget",
    d: "We check income and existing payments so the loan you get is one you can actually repay.",
    icon: "M3 3v18h18M7 15l4-4 3 3 5-6",
  },
  {
    t: "Your data stays yours",
    d: "256-bit encryption, strict access controls, and we never sell personal information. Ever.",
    icon: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  },
  {
    t: "People who pick up",
    d: "U.S.-based support six days a week. If you hit a rough patch, we’d rather talk than send letters.",
    icon: "M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z",
  },
  {
    t: "Reward for paying early",
    d: "No prepayment penalty, ever. Pay off sooner and keep the interest you didn’t need to spend.",
    icon: "M12 3v18M17 7H9.5a3 3 0 000 6h5a3 3 0 010 6H6",
  },
  {
    t: "Fast, not rushed",
    d: "Decisions in minutes and funding often next business day, with time to read your agreement first.",
    icon: "M13 2L4 14h7l-1 8 9-12h-7z",
  },
];

const COMPARE: {
  row: string;
  lumen: string | boolean;
  card: string | boolean;
  payday: string | boolean;
}[] = [
  { row: "Fixed monthly payment", lumen: true, card: false, payday: false },
  { row: "Clear payoff date", lumen: true, card: false, payday: true },
  { row: "No prepayment penalty", lumen: true, card: true, payday: false },
  { row: "Checks ability to repay", lumen: true, card: true, payday: false },
  {
    row: "Typical repayment window",
    lumen: "12–48 months",
    card: "Open-ended",
    payday: "2–4 weeks",
  },
  {
    row: "Loan amounts",
    lumen: "$1k–$35k",
    card: "Credit limit",
    payday: "Usually < $500",
  },
];

function Cell({ v, strong }: { v: string | boolean; strong?: boolean }) {
  if (typeof v === "string")
    return (
      <span className={strong ? "font-semibold" : "text-ink/60"}>{v}</span>
    );
  return v ? (
    <span
      className={`inline-grid h-7 w-7 place-items-center rounded-full ${strong ? "bg-lime text-ink" : "bg-ink/5 text-moss"}`}
    >
      <CheckIcon className="h-4 w-4" />
    </span>
  ) : (
    <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-coral/10 text-coral">
      <svg
        viewBox="0 0 20 20"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <path d="M5 5l10 10M15 5L5 15" />
      </svg>
    </span>
  );
}

export default function WhyLumenPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="Why Lumen"
        title={
          <>
            Borrowing should feel <em className="text-lime italic">clear</em>,
            not cornered.
          </>
        }
      >
        We started Lumen because personal loans were either confusing or
        predatory. So we built one that’s neither: simple terms, honest numbers
        and people who answer the phone.
      </PageHero>

      <section className="border-b border-ink/10 bg-cream">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 lg:grid-cols-4 lg:px-8">
          {[
            ["5 min", "average application"],
            ["$0", "to check your rate"],
            ["6 days", "a week of human support"],
            ["0", "prepayment penalties"],
          ].map(([v, l]) => (
            <div key={l} className="py-10">
              <dt className="font-display text-4xl font-semibold sm:text-5xl">
                {v}
              </dt>
              <dd className="mt-1 text-sm text-ink/55">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
            What we stand for
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Six promises we build every loan around.
          </h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.t}
                className="group rounded-3xl bg-white p-8 ring-1 ring-ink/5 transition hover:-translate-y-1 hover:bg-ink hover:text-white hover:shadow-2xl"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/50 text-moss transition group-hover:bg-lime group-hover:text-ink">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={v.icon} />
                  </svg>
                </span>
                <h3 className="mt-6 text-xl font-semibold">{v.t}</h3>
                <p className="mt-3 leading-relaxed text-ink/60 transition group-hover:text-white/65">
                  {v.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
            Compare
          </p>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            How a Lumen loan stacks up.
          </h2>
          <div className="mt-12 overflow-x-auto rounded-3xl bg-paper ring-1 ring-ink/10">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10">
                  <th className="px-6 py-5 font-medium text-ink/50" />
                  <th className="bg-ink px-6 py-5 font-display text-lg font-semibold text-lime">
                    Lumen
                  </th>
                  <th className="px-6 py-5 font-medium text-ink/60">
                    Credit card
                  </th>
                  <th className="px-6 py-5 font-medium text-ink/60">
                    Payday loan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {COMPARE.map((c) => (
                  <tr key={c.row}>
                    <td className="px-6 py-5 font-medium">{c.row}</td>
                    <td className="bg-lime/15 px-6 py-5">
                      <Cell v={c.lumen} strong />
                    </td>
                    <td className="px-6 py-5">
                      <Cell v={c.card} />
                    </td>
                    <td className="px-6 py-5">
                      <Cell v={c.payday} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-ink/45">
            General comparison of typical product features. Individual products
            vary.
          </p>
        </div>
      </section>

      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-3 lg:px-8">
          {[
            {
              q: "I consolidated three cards into one payment and finally see an end date. The whole thing took one lunch break.",
              n: "Alicia M.",
              r: "Austin, TX",
            },
            {
              q: "No pushy calls, no weird fees. The offer showed exactly what I’d pay, and the money was there the next morning.",
              n: "Jordan K.",
              r: "Columbus, OH",
            },
            {
              q: "When my hours got cut I called, and a real person helped me move my payment date. That’s why I’d use them again.",
              n: "Priya S.",
              r: "Tampa, FL",
            },
          ].map((t) => (
            <figure
              key={t.n}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-ink/5"
            >
              <div>
                <div className="text-coral">★★★★★</div>
                <blockquote className="mt-5 font-display text-xl leading-snug">
                  “{t.q}”
                </blockquote>
              </div>
              <figcaption className="mt-8 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ink font-semibold text-lime">
                  {t.n[0]}
                </span>
                <span>
                  <span className="block font-semibold">{t.n}</span>
                  <span className="text-sm text-ink/50">
                    {t.r} · sample review
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <CtaBand title="See what Lumen can do for you." />
    </Shell>
  );
}
