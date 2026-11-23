import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { LoanCalculator } from "@/components/site/LoanCalculator";
import { loanSummary, usd } from "@/lib/loan";
import Link from "next/link";

const STEPS = [
  {
    n: "01",
    t: "Tell us a little",
    d: "A five-minute application. Checking your rate is a soft pull, so your credit score stays put.",
  },
  {
    n: "02",
    t: "See your offer",
    d: "Get a decision in minutes with your exact APR, monthly payment and total cost, all up front.",
  },
  {
    n: "03",
    t: "Sign on any screen",
    d: "Review the terms, then e-sign from your phone or laptop. Nothing to print, scan or mail.",
  },
  {
    n: "04",
    t: "Get your money",
    d: "Funds go straight to your bank account, often by the next business day.",
  },
];

const EXAMPLES = [
  { amount: 2500, term: 12, apr: 10 },
  { amount: 7500, term: 24, apr: 10 },
  { amount: 15000, term: 36, apr: 10 },
  { amount: 30000, term: 48, apr: 10 },
];

const FAQS = [
  {
    q: "Will checking my rate affect my credit score?",
    a: "No. We start with a soft credit inquiry, which doesn’t affect your score. A hard inquiry only happens if you accept an offer and move forward.",
  },
  {
    q: "How fast can I get the money?",
    a: "Most decisions take a few minutes. Once you e-sign, funds are usually sent by the next business day, depending on your bank.",
  },
  {
    q: "Are there prepayment penalties?",
    a: "Never. Pay extra or pay the loan off early whenever you want, and you’ll save on interest.",
  },
  {
    q: "What do I need to apply?",
    a: "You need to be 18 or older with a valid SSN, a steady source of income, an active bank account, and a working email and phone number.",
  },
  {
    q: "Is my information secure?",
    a: "Yes. Your data is encrypted in transit and at rest using bank-level 256-bit encryption, and we never sell your personal information.",
  },
];

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="grain relative overflow-hidden bg-ink pt-32 pb-24 text-white lg:pt-40 lg:pb-32">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-10%] h-[620px] w-[620px] rounded-full bg-lime/20 blur-[140px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[-30%] left-[-10%] h-[520px] w-[520px] rounded-full bg-moss/60 blur-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-[1.15fr_1fr] lg:px-8">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/80 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-lime opacity-70" />
                  <span className="relative h-2 w-2 rounded-full bg-lime" />
                </span>
                Rates from 9.95% APR · No impact to your credit score
              </span>
              <h1 className="mt-7 font-display text-5xl leading-[1.02] font-medium tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
                Money for what’s next,{" "}
                <em className="font-normal text-lime italic">minus</em> the fine
                print.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">
                Personal loans from $1,000 to $35,000 with one fixed rate, one
                fixed payment, and a clear end date. No origination games and no
                prepayment penalties.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/apply"
                  className="rounded-full bg-lime px-8 py-4 font-semibold text-ink transition hover:bg-white"
                >
                  Get started — it’s free
                </Link>
                <Link
                  href="#how"
                  className="rounded-full border border-white/20 px-8 py-4 font-medium text-white transition hover:bg-white/10"
                >
                  How it works
                </Link>
              </div>
              <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {[
                  ["5 min", "to apply"],
                  ["$0", "to check your rate"],
                  ["4.9★", "from 12k+ reviews"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-display text-3xl font-semibold text-white">
                      {v}
                    </dt>
                    <dd className="mt-1 text-sm text-white/50">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="animate-rise [animation-delay:150ms] lg:pl-6">
              <LoanCalculator />
            </div>
          </div>
        </section>

        {/* MARQUEE OF USES */}
        <section className="border-b border-ink/10 bg-cream py-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 text-sm font-medium text-ink/55">
            {[
              "Debt consolidation",
              "Home repairs",
              "Medical bills",
              "Car trouble",
              "Moving",
              "Big life moments",
            ].map((u) => (
              <span key={u} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-moss" />
                {u}
              </span>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="scroll-mt-20 bg-paper py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
                  How it works
                </p>
                <h2 className="mt-4 max-w-2xl font-display text-4xl font-medium tracking-tight sm:text-5xl">
                  From “I need it” to “it’s here” in four calm steps.
                </h2>
              </div>
              <Link
                href="/apply"
                className="self-start rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss md:self-auto"
              >
                Start my application →
              </Link>
            </div>
            <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className="group bg-paper p-8 transition hover:bg-white"
                >
                  <span className="font-display text-6xl font-light text-ink/15 transition group-hover:text-moss">
                    {s.n}
                  </span>
                  <h3 className="mt-8 text-xl font-semibold">{s.t}</h3>
                  <p className="mt-3 leading-relaxed text-ink/60">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* WHY — BENTO */}
        <section id="why" className="scroll-mt-20 bg-cream py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
              Why Lumen
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Built to be the loan you’d recommend to a friend.
            </h2>
            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              <div className="grain relative overflow-hidden rounded-3xl bg-ink p-8 text-white md:p-10">
                <div
                  aria-hidden
                  className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-lime/25 blur-3xl"
                />
                <p className="text-sm uppercase tracking-[0.2em] text-lime">
                  Total transparency
                </p>
                <h3 className="mt-4 font-display text-3xl font-medium leading-tight sm:text-4xl">
                  You see every dollar before you sign.
                </h3>
                <p className="mt-4 max-w-md text-white/60">
                  Your offer shows APR, monthly payment, number of payments and
                  total cost side by side. What you see is what you repay.
                </p>
                <div className="relative mt-10 animate-float rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Your offer</span>
                    <span className="rounded-full bg-lime px-2.5 py-0.5 text-xs font-semibold text-ink">
                      Approved
                    </span>
                  </div>
                  <p className="mt-3 font-display text-4xl font-semibold">
                    $12,000
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-white/50">APR</p>
                      <p className="mt-1 font-semibold">11.99%</p>
                    </div>
                    <div>
                      <p className="text-white/50">Monthly</p>
                      <p className="mt-1 font-semibold">
                        {usd(loanSummary(12000, 11.99, 36).monthly, true)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50">Term</p>
                      <p className="mt-1 font-semibold">36 mo</p>
                    </div>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/3 rounded-full bg-lime" />
                  </div>
                  <p className="mt-2 text-xs text-white/50">
                    12 of 36 payments made · on track
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  {
                    t: "Decisions in minutes",
                    d: "Smart underwriting that looks beyond a single score.",
                    icon: "M13 2L4 14h7l-1 8 9-12h-7z",
                  },
                  {
                    t: "No prepayment penalty",
                    d: "Pay early, pay extra, pay it off. You save on interest.",
                    icon: "M12 3v18M17 7H9.5a3 3 0 000 6h5a3 3 0 010 6H6",
                  },
                  {
                    t: "Bank-level security",
                    d: "256-bit encryption. We never sell your data.",
                    icon: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
                  },
                  {
                    t: "Humans, not bots",
                    d: "U.S.-based support six days a week.",
                    icon: "M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z",
                  },
                ].map((f) => (
                  <div
                    key={f.t}
                    className="rounded-3xl bg-paper p-7 ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/50 text-moss">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={f.icon} />
                      </svg>
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{f.t}</h3>
                    <p className="mt-2 text-ink/60">{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RATES */}
        <section id="rates" className="scroll-mt-20 bg-paper py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1fr_1.4fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
                Rates &amp; fees
              </p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Real numbers. No asterisk maze.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ink/60">
                APRs range from 9.95% to 35.99% depending on your credit, income
                and state. There’s no fee to apply and no penalty for paying
                early.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "$0 application fee",
                  "$0 prepayment penalty",
                  "Fixed rate for the life of the loan",
                  "Autopay keeps you on track",
                ].map((x) => (
                  <li key={x} className="flex items-center gap-3 text-ink/80">
                    <span className="text-moss">
                      <Check />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-3xl ring-1 ring-ink/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-ink text-white">
                  <tr>
                    {["Amount", "Term", "APR", "Monthly", "Total repaid"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-4 font-medium text-white/70"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 bg-white">
                  {EXAMPLES.map((e) => {
                    const s = loanSummary(e.amount, e.apr, e.term);
                    return (
                      <tr key={e.amount} className="transition hover:bg-cream">
                        <td className="px-5 py-5 font-display text-lg font-semibold">
                          {usd(e.amount)}
                        </td>
                        <td className="px-5 py-5 text-ink/70">{e.term} mo</td>
                        <td className="px-5 py-5 text-ink/70">{e.apr}%</td>
                        <td className="px-5 py-5 font-semibold text-moss tabular-nums">
                          {usd(s.monthly, true)}
                        </td>
                        <td className="px-5 py-5 text-ink/70 tabular-nums">
                          {usd(s.total, true)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="bg-cream px-5 py-4 text-xs text-ink/50">
                Representative examples only. Your rate and terms depend on
                approval.
              </p>
            </div>
          </div>
        </section>

        {/* ELIGIBILITY + TESTIMONIALS */}
        <section className="bg-cream py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-3 lg:px-8">
            <div className="rounded-3xl bg-moss p-8 text-white lg:p-10">
              <h3 className="font-display text-3xl font-medium">
                Can I apply?
              </h3>
              <p className="mt-3 text-white/65">
                If you can tick these, you’re ready.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "18 or older with a valid SSN",
                  "Steady source of income",
                  "Active bank account",
                  "Valid email and phone",
                ].map((x) => (
                  <li key={x} className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-lime text-ink">
                      <Check />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
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
            ].map((t) => (
              <figure
                key={t.n}
                className="flex flex-col justify-between rounded-3xl bg-paper p-8 ring-1 ring-ink/5 lg:p-10"
              >
                <div>
                  <div className="text-coral">★★★★★</div>
                  <blockquote className="mt-5 font-display text-2xl leading-snug">
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

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 bg-paper py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.6fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
                FAQ
              </p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Good questions.
              </h2>
              <p className="mt-5 text-ink/60">
                Still curious? Call us at{" "}
                <a
                  href="tel:18005550199"
                  className="font-semibold text-ink underline decoration-lime decoration-2 underline-offset-4"
                >
                  1-800-555-0199
                </a>
                .
              </p>
            </div>
            <div className="divide-y divide-ink/10 border-y border-ink/10">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-6">
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
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-24 lg:px-8">
          <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-lime px-8 py-16 text-center sm:px-16 lg:py-24">
            <div
              aria-hidden
              className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/40 blur-3xl"
            />
            <h2 className="relative mx-auto max-w-3xl font-display text-4xl font-medium tracking-tight text-ink sm:text-6xl">
              Your rate is five minutes away.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-lg text-ink/70">
              Checking won’t affect your credit score. No commitment, no fees.
            </p>
            <Link
              href="/apply"
              className="relative mt-10 inline-flex rounded-full bg-ink px-10 py-4 font-semibold text-lime transition hover:scale-[1.03]"
            >
              Check my rate
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
