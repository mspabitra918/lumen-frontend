"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PROFILES, loanSummary, usd } from "@/lib/loan";

import { AMOUNT_STEP, MAX_AMOUNT, MIN_AMOUNT } from "../apply/types";
import { LOAN_TERMS } from "../apply/options";
export function LoanCalculator() {
  const [amount, setAmount] = useState(10000);
  const [term, setTerm] = useState(36);
  const [profile, setProfile] =
    useState<(typeof PROFILES)[number]["key"]>("good");

  const apr = PROFILES.find((p) => p.key === profile)!.apr;
  const s = useMemo(() => loanSummary(amount, apr, term), [amount, apr, term]);
  const pct = ((amount - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100;
  const principalShare = amount / s.total;

  // Donut geometry
  const R = 34,
    C = 2 * Math.PI * R;

  return (
    <div className="relative rounded-[28px] bg-paper p-6 text-ink shadow-[0_40px_80px_-20px_rgb(0_0_0/0.55)] ring-1 ring-black/5 sm:p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink/60">I’d like to borrow</p>
        <span className="rounded-full bg-lime/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-moss">
          Soft check
        </span>
      </div>
      <p className="mt-1 font-display text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
        {usd(amount)}
      </p>

      <input
        aria-label="Loan amount"
        type="range"
        className="slider mt-6 w-full"
        min={MIN_AMOUNT}
        max={MAX_AMOUNT}
        step={AMOUNT_STEP}
        value={amount}
        style={{ ["--pct" as string]: `${pct}%` }}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <div className="mt-2 flex justify-between text-xs text-ink/45">
        <span>{usd(MIN_AMOUNT)}</span>
        <span>{usd(MAX_AMOUNT)}</span>
      </div>

      <p className="mt-6 text-sm font-medium text-ink/60">Over</p>
      <div
        className="mt-2 grid grid-cols-4 gap-2"
        role="radiogroup"
        aria-label="Term"
      >
        {LOAN_TERMS.map((t) => (
          <button
            key={t.value}
            role="radio"
            aria-checked={term === t.value}
            onClick={() => setTerm(t.value)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              term === t.value
                ? "bg-ink text-lime"
                : "bg-cream text-ink/70 hover:bg-ink/10"
            }`}
          >
            {t.value}
            <span className="ml-0.5 text-xs font-normal opacity-70">mo</span>
          </button>
        ))}
      </div>

      {/* <p className="mt-5 text-sm font-medium text-ink/60">My credit is</p>
      <div className="mt-2 flex rounded-xl bg-cream p-1" role="radiogroup" aria-label="Credit profile">
        {PROFILES.map((p) => (
          <button
            key={p.key}
            role="radio"
            aria-checked={profile === p.key}
            onClick={() => setProfile(p.key)}
            className={`flex-1 rounded-lg py-2 text-sm transition ${
              profile === p.key ? "bg-white font-semibold shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div> */}

      <div className="mt-6 flex items-center gap-5 rounded-2xl bg-ink p-5 text-white">
        <svg
          viewBox="0 0 80 80"
          className="h-20 w-20 shrink-0 -rotate-90"
          aria-hidden
        >
          <circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            stroke="var(--color-coral)"
            strokeWidth="10"
          />
          <circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            stroke="var(--color-lime)"
            strokeWidth="10"
            strokeDasharray={`${C * principalShare} ${C}`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-white/50">
            Est. monthly payment
          </p>
          <p className="font-display text-3xl font-semibold tabular-nums text-lime">
            {usd(s.monthly, true)}
          </p>
          <p className="mt-1 text-xs text-white/60">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-lime" />
            Principal {usd(amount)}
            <span className="mx-1.5 ml-3 inline-block h-2 w-2 rounded-full bg-coral" />
            Interest {usd(s.interest)}
          </p>
        </div>
      </div>

      <Link
        href={`/apply?amount=${amount}&term=${term}`}
        className="group mt-5 flex items-center justify-center gap-2 rounded-full bg-lime py-4 font-semibold text-ink transition hover:bg-lime-2"
      >
        Check my rate
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4 transition group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
      </Link>
      <p className="mt-3 text-center text-[11px] leading-snug text-ink/45">
        Illustrative at {apr}% APR. Your actual rate depends on approval and
        state of residence.
      </p>
    </div>
  );
}
