"use client";

import { LOAN_PURPOSES, LOAN_TERMS } from "../options";
import { AMOUNT_STEP, MAX_AMOUNT, MIN_AMOUNT } from "../types";
import { ChoiceCards, SelectField, TextField } from "../fields";
import type { StepProps } from "./shared";
import { loanSummary, usd } from "@/lib/loan";

export function LoanStep({ value, set, errors }: StepProps<"loan">) {
  const inRange = value.amount >= MIN_AMOUNT && value.amount <= MAX_AMOUNT;
  const pct =
    ((Math.min(Math.max(value.amount || MIN_AMOUNT, MIN_AMOUNT), MAX_AMOUNT) -
      MIN_AMOUNT) /
      (MAX_AMOUNT - MIN_AMOUNT)) *
    100;

  return (
    <div className="space-y-8">
      <div
        className="rounded-3xl bg-cream p-6 sm:p-8"
        data-error={errors.amount ? "true" : undefined}
      >
        <p className="text-sm font-medium text-ink/60">
          How much would you like to borrow?
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <p className="font-display text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
            {Number.isFinite(value.amount) && value.amount > 0
              ? usd(value.amount)
              : "$—"}
          </p>
          {/* <TextField
            label="Or type an exact amount"
            prefix="$"
            inputMode="numeric"
            wrapClass="w-48"
            value={Number.isFinite(value.amount) && value.amount > 0 ? String(value.amount) : ""}
            onChange={(v) => set("amount", v ? Number(digits(v, 5)) : NaN)}
          /> */}
        </div>
        <input
          aria-label="Loan amount"
          type="range"
          className="slider mt-6 w-full"
          min={MIN_AMOUNT}
          max={MAX_AMOUNT}
          step={AMOUNT_STEP}
          value={inRange ? value.amount : MIN_AMOUNT}
          style={{ ["--pct" as string]: `${pct}%` }}
          onChange={(e) => set("amount", Number(e.target.value))}
        />
        <div className="mt-2 flex justify-between text-xs text-ink/45">
          <span>{usd(MIN_AMOUNT)}</span>
          <span>{usd(MAX_AMOUNT)}</span>
        </div>
        {errors.amount && (
          <p className="mt-3 text-sm text-coral" role="alert">
            {errors.amount}
          </p>
        )}
      </div>

      <ChoiceCards
        label="Repayment term"
        cols={4}
        value={value.loanTerm}
        onChange={(v) => set("loanTerm", v)}
        error={errors.loanTerm}
        options={LOAN_TERMS.map((t) => ({
          ...t,
          hint: inRange
            ? `~${usd(loanSummary(value.amount, 10, t.value).monthly)}/mo`
            : undefined,
        }))}
      />

      <SelectField
        label="What’s the loan for?"
        value={value.purpose}
        onChange={(v) => set("purpose", v)}
        options={LOAN_PURPOSES}
        error={errors.purpose}
      />

      {value.purpose === "other" && (
        <TextField
          label="Tell us a bit more"
          value={value.otherPurpose}
          onChange={(v) => set("otherPurpose", v.slice(0, 200))}
          error={errors.otherPurpose}
          placeholder="e.g. Replacing a furnace"
          maxLength={200}
        />
      )}
    </div>
  );
}
