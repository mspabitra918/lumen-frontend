import type { Metadata } from "next";
import Link from "next/link";
import { Shell, CheckIcon } from "@/lumen-frontend/components/site/Shell";
import { PageHero } from "@/lumen-frontend/components/site/PageHero";
import { CtaBand } from "@/lumen-frontend/components/site/CtaBand";
import { ILLUSTRATIVE_APR, loanSummary, usd } from "@/lumen-frontend/lib/loan";

export const metadata: Metadata = {
  title: "How it works — Lumen",
  description: "From application to funding in four steps.",
};

const STEPS = [
  {
    n: "01",
    t: "Tell us a little",
    time: "~5 minutes",
    d: "Pick an amount and term, then share some basics about you, your income and your bank. Checking your rate uses a soft credit pull, so your score doesn’t change.",
    points: [
      "Choose $1,000–$35,000",
      "Terms of 12, 24, 36 or 48 months",
      "Soft pull only. No score impact",
    ],
  },
  {
    n: "02",
    t: "See your offer",
    time: "Minutes",
    d: "Our underwriting looks at the whole picture: income, existing debts and banking history, not just a single score. If you’re approved, you’ll see the details side by side.",
    points: [
      "Exact APR and monthly payment",
      "Total cost of the loan",
      "No obligation to accept",
    ],
  },
  {
    n: "03",
    t: "Review & e-sign",
    time: "A few minutes",
    d: "Read your loan agreement on any device. If it looks right, sign electronically. If we need to verify anything, we’ll ask for it through a secure upload link.",
    points: [
      "Sign from phone or laptop",
      "Set up optional autopay",
      "Ask us anything before signing",
    ],
  },
  {
    n: "04",
    t: "Get your money",
    time: "Often next business day",
    d: "Funds are sent by ACH to the bank account you gave us. Then manage everything online: check your balance, make extra payments, or pay off early with no penalty.",
    points: [
      "Direct deposit to your account",
      "Payment reminders before due dates",
      "Pay off early, save interest",
    ],
  },
];

const NEED = [
  { t: "Government ID", d: "Driver’s license or state ID number" },
  { t: "Social Security number", d: "For identity and a soft credit check" },
  { t: "Income details", d: "Employer, pay schedule and take-home pay" },
  { t: "Bank account", d: "Routing and account numbers" },
];

export default function HowItWorksPage() {
  const ex = loanSummary(5000, ILLUSTRATIVE_APR, 24);
  return (
    <Shell>
      <PageHero
        eyebrow="How it works"
        title={
          <>
            Four steps. <em className="text-lime italic">No</em> runaround.
          </>
        }
      >
        From “I need it” to money in your account, often by the next business
        day. Here’s exactly what happens at each step.
      </PageHero>

      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <ol className="relative space-y-6 before:absolute before:top-4 before:bottom-4 before:left-[27px] before:w-px before:bg-ink/10 md:before:left-[35px]">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="relative grid gap-6 md:grid-cols-[72px_1fr]"
              >
                <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-ink font-display text-xl font-semibold text-lime md:h-18 md:w-18 md:text-2xl">
                  {s.n}
                </span>
                <div className="grid gap-8 rounded-3xl bg-white p-8 ring-1 ring-ink/5 transition hover:shadow-xl lg:grid-cols-[1.3fr_1fr] lg:p-10">
                  <div>
                    <span className="inline-flex rounded-full bg-lime/40 px-3 py-1 text-xs font-semibold text-moss">
                      {s.time}
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                      {s.t}
                    </h2>
                    <p className="mt-4 leading-relaxed text-ink/60">{s.d}</p>
                  </div>
                  <ul className="space-y-3 self-center rounded-2xl bg-cream p-6">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-3 text-sm font-medium"
                      >
                        <span className="text-moss">
                          <CheckIcon />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
              Before you start
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              What you’ll need.
            </h2>
            <p className="mt-5 max-w-md text-lg text-ink/60">
              Have these handy and the whole application takes about five
              minutes.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {NEED.map((n, i) => (
                <div
                  key={n.t}
                  className="rounded-2xl bg-paper p-6 ring-1 ring-ink/5"
                >
                  <span className="font-display text-3xl text-ink/20">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-semibold">{n.t}</h3>
                  <p className="mt-1 text-sm text-ink/55">{n.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grain relative overflow-hidden rounded-3xl bg-ink p-8 text-white lg:p-12">
            <div
              aria-hidden
              className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-lime/25 blur-3xl"
            />
            <p className="text-sm uppercase tracking-[0.2em] text-lime">
              Example loan
            </p>
            <p className="mt-4 font-display text-6xl font-semibold">
              {usd(5000)}
            </p>
            <p className="mt-2 text-white/60">
              over 24 months at {ILLUSTRATIVE_APR}% APR
            </p>
            <dl className="relative mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div>
                <dt className="text-sm text-white/50">Monthly payment</dt>
                <dd className="mt-1 font-display text-3xl text-lime">
                  {usd(ex.monthly, true)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Total interest</dt>
                <dd className="mt-1 font-display text-3xl">
                  {usd(ex.interest, true)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Total repaid</dt>
                <dd className="mt-1 font-display text-3xl">
                  {usd(ex.total, true)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Prepayment fee</dt>
                <dd className="mt-1 font-display text-3xl">$0</dd>
              </div>
            </dl>
            <p className="relative mt-8 text-xs text-white/40">
              Illustrative only. Your rate and terms depend on approval and
              state of residence.
            </p>
            <Link
              href="/rates"
              className="relative mt-6 inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              See rates &amp; fees →
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </Shell>
  );
}
