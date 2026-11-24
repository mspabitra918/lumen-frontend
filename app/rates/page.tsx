import type { Metadata } from "next";
import { Shell, CheckIcon } from "@/components/site/Shell";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { LoanCalculator } from "@/components/site/LoanCalculator";
import { Amortization } from "@/components/site/Amortization";
import { LOAN_TERMS } from "@/components/apply/options";
import { ILLUSTRATIVE_APR, loanSummary, usd } from "@/lib/loan";

export const metadata: Metadata = {
  title: "Rates & fees — Lumen",
  description: "Clear rates, fixed payments and no prepayment penalties.",
};

const AMOUNTS = [1000, 2500, 5000, 10000, 15000, 25000, 35000];

const FEES = [
  {
    fee: "Application fee",
    v: "$0",
    note: "Checking your rate is always free.",
  },
  {
    fee: "Prepayment penalty",
    v: "$0",
    note: "Pay early or pay off any time.",
  },
  {
    fee: "Late payment fee",
    v: "Varies by state",
    note: "Shown in your loan agreement, only where permitted.",
  },
  {
    fee: "Returned payment fee",
    v: "Varies by state",
    note: "Charged only where permitted by law.",
  },
  {
    fee: "Hidden fees",
    v: "None",
    note: "Every cost is listed before you sign.",
  },
];

export default function RatesPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="Rates & fees"
        title={
          <>
            Real numbers. <em className="text-lime italic">No</em> asterisk
            maze.
          </>
        }
      >
        One fixed rate, one fixed payment, and a total cost you see before you
        sign. Examples on this page use an illustrative {ILLUSTRATIVE_APR}% APR.
      </PageHero>

      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
              Estimate your payment
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Play with the numbers.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/60">
              Your actual APR depends on your credit history, income, existing
              debts, loan amount, term and state of residence. You’ll see your
              exact rate before you commit to anything.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Fixed rate for the life of the loan",
                "Same payment every month",
                "Checking your rate won’t affect your score",
              ].map((x) => (
                <li key={x} className="flex items-center gap-3 text-ink/80">
                  <span className="text-moss">
                    <CheckIcon />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <LoanCalculator />
        </div>
      </section>

      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
            Payment table
          </p>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Monthly payment by amount &amp; term.
          </h2>
          <div className="mt-12 overflow-x-auto rounded-3xl ring-1 ring-ink/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-ink text-white">
                <tr>
                  <th className="px-5 py-4 font-medium text-white/70">
                    Amount
                  </th>
                  {LOAN_TERMS.map((t) => (
                    <th
                      key={t.value}
                      className="px-5 py-4 font-medium text-white/70"
                    >
                      {t.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 bg-white tabular-nums">
                {AMOUNTS.map((a) => (
                  <tr key={a} className="transition hover:bg-cream">
                    <td className="px-5 py-4 font-display text-lg font-semibold">
                      {usd(a)}
                    </td>
                    {LOAN_TERMS.map((t) => {
                      const s = loanSummary(a, ILLUSTRATIVE_APR, t.value);
                      return (
                        <td key={t.value} className="px-5 py-4">
                          <span className="font-semibold text-moss">
                            {usd(s.monthly, true)}
                          </span>
                          <span className="block text-xs text-ink/45">
                            {usd(s.total)} total
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="bg-paper px-5 py-4 text-xs text-ink/50">
              Representative examples at {ILLUSTRATIVE_APR}% APR. Your rate and
              terms depend on approval.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
            Where your money goes
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-medium tracking-tight sm:text-5xl">
            See your loan pay down, month by month.
          </h2>
          <div className="mt-12">
            <Amortization />
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1fr_1.5fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
              Fees
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              The short list.
            </h2>
            <p className="mt-5 text-lg text-ink/60">
              We keep fees few and simple, and every one appears in your
              agreement before you sign.
            </p>
          </div>
          <div className="divide-y divide-ink/10 rounded-3xl bg-paper px-6 ring-1 ring-ink/5 sm:px-8">
            {FEES.map((f) => (
              <div
                key={f.fee}
                className="flex flex-col gap-1 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{f.fee}</p>
                  <p className="text-sm text-ink/55">{f.note}</p>
                </div>
                <span
                  className={`font-display text-2xl ${f.v === "$0" || f.v === "None" ? "text-moss" : "text-ink/70"}`}
                >
                  {f.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Find out your real rate." />
    </Shell>
  );
}
