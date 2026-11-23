"use client";

import { useMemo, useState } from "react";
import { ILLUSTRATIVE_APR, monthlyPayment, usd } from "@/lib/loan";
import { AMOUNT_STEP, MAX_AMOUNT, MIN_AMOUNT } from "../apply/types";
import { LOAN_TERMS } from "../apply/options";

type Row = {
  month: number;
  interest: number;
  principal: number;
  balance: number;
};

function schedule(amount: number, apr: number, term: number): Row[] {
  const pay = monthlyPayment(amount, apr, term);
  const r = apr / 100 / 12;
  let bal = amount;
  const rows: Row[] = [];
  for (let m = 1; m <= term; m++) {
    const interest = bal * r;
    const principal = Math.min(pay - interest, bal);
    bal = Math.max(0, bal - principal);
    rows.push({ month: m, interest, principal, balance: bal });
  }
  return rows;
}

export function Amortization() {
  const [amount, setAmount] = useState(10000);
  const [term, setTerm] = useState(36);
  const rows = useMemo(
    () => schedule(amount, ILLUSTRATIVE_APR, term),
    [amount, term],
  );
  const pay = monthlyPayment(amount, ILLUSTRATIVE_APR, term);
  const totalInterest = rows.reduce((s, r) => s + r.interest, 0);

  const years = Array.from({ length: Math.ceil(term / 12) }, (_, y) => {
    const slice = rows.slice(y * 12, y * 12 + 12);
    return {
      year: y + 1,
      principal: slice.reduce((s, r) => s + r.principal, 0),
      interest: slice.reduce((s, r) => s + r.interest, 0),
      end: slice[slice.length - 1].balance,
    };
  });

  const W = 600,
    H = 200;
  const pts = [{ month: 0, balance: amount }, ...rows].map(
    (r) => `${(r.month / term) * W},${H - (r.balance / amount) * H}`,
  );
  const pct = ((amount - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100;

  return (
    <div className="grid gap-8 rounded-3xl bg-white p-6 ring-1 ring-ink/5 sm:p-10 lg:grid-cols-[320px_1fr]">
      <div>
        <p className="text-sm font-medium text-ink/60">Loan amount</p>
        <p className="mt-1 font-display text-4xl font-semibold tabular-nums">
          {usd(amount)}
        </p>
        <input
          aria-label="Loan amount"
          type="range"
          className="slider mt-4 w-full"
          min={MIN_AMOUNT}
          max={MAX_AMOUNT}
          step={AMOUNT_STEP}
          value={amount}
          style={{ ["--pct" as string]: `${pct}%` }}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <p className="mt-6 text-sm font-medium text-ink/60">Term</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {LOAN_TERMS.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={term === t.value}
              onClick={() => setTerm(t.value)}
              className={`rounded-xl py-2.5 text-sm font-semibold transition ${term === t.value ? "bg-ink text-lime" : "bg-cream text-ink/70 hover:bg-ink/10"}`}
            >
              {t.value}
            </button>
          ))}
        </div>
        <dl className="mt-8 space-y-3 border-t border-ink/10 pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/55">Monthly payment</dt>
            <dd className="font-semibold tabular-nums">{usd(pay, true)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/55">Total interest</dt>
            <dd className="font-semibold tabular-nums">
              {usd(totalInterest, true)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/55">Total repaid</dt>
            <dd className="font-semibold tabular-nums">
              {usd(amount + totalInterest, true)}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-ink/45">
          At an illustrative {ILLUSTRATIVE_APR}% APR.
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-ink/60">Balance over time</p>
        <svg
          viewBox={`0 0 ${W} ${H + 4}`}
          className="mt-4 h-48 w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Balance falls from ${usd(amount)} to $0 over ${term} months`}
        >
          <defs>
            <linearGradient id="bal" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0"
                stopColor="var(--color-lime)"
                stopOpacity="0.7"
              />
              <stop
                offset="1"
                stopColor="var(--color-lime)"
                stopOpacity="0.05"
              />
            </linearGradient>
          </defs>
          <polygon
            points={`0,${H} ${pts.join(" ")} ${W},${H}`}
            fill="url(#bal)"
          />
          <polyline
            points={pts.join(" ")}
            fill="none"
            stroke="var(--color-moss)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="mt-1 flex justify-between text-xs text-ink/45">
          <span>Month 0</span>
          <span>Month {term}</span>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/50">
                <th className="py-3 font-medium">Year</th>
                <th className="py-3 font-medium">Principal paid</th>
                <th className="py-3 font-medium">Interest paid</th>
                <th className="py-3 text-right font-medium">
                  Balance at year end
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5 tabular-nums">
              {years.map((y) => (
                <tr key={y.year}>
                  <td className="py-3 font-semibold">{y.year}</td>
                  <td className="py-3">{usd(y.principal, true)}</td>
                  <td className="py-3 text-ink/60">{usd(y.interest, true)}</td>
                  <td className="py-3 text-right font-semibold">
                    {usd(y.end, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
