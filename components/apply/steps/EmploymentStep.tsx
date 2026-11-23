"use client";

import {
  EMPLOYED_STATUSES,
  EMPLOYMENT_STATUSES,
  INCOME_SOURCES,
  PAY_FREQUENCIES,
} from "../options";
import { ChoiceCards, SectionTitle, SelectField, TextField } from "../fields";
import { numText, toNum, type StepProps } from "./shared";
import { digits, formatPhone } from "@/lib/loan";

export function EmploymentStep({
  value: em,
  set,
  errors: e,
}: StepProps<"employment">) {
  const employed = EMPLOYED_STATUSES.includes(em.employmentStatus);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <SelectField
        label="Employment status"
        value={em.employmentStatus}
        onChange={(v) => set("employmentStatus", v)}
        options={EMPLOYMENT_STATUSES}
        error={e.employmentStatus}
      />

      {employed && (
        <>
          <SectionTitle
            title={
              em.employmentStatus === "self_employed"
                ? "Your business"
                : "Your employer"
            }
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label={
                em.employmentStatus === "self_employed"
                  ? "Business name"
                  : "Employer name"
              }
              autoComplete="organization"
              value={em.employerName}
              onChange={(v) => set("employerName", v)}
              error={e.employerName}
            />
            <TextField
              label="Job title"
              autoComplete="organization-title"
              value={em.jobTitle}
              onChange={(v) => set("jobTitle", v)}
              error={e.jobTitle}
            />
            <TextField
              label="Time there (months)"
              inputMode="numeric"
              value={numText(em.employmentLengthMo)}
              onChange={(v) => set("employmentLengthMo", toNum(digits(v, 3)))}
              error={e.employmentLengthMo}
              hint="e.g. 18 for a year and a half"
            />
            <TextField
              label="Work phone"
              type="tel"
              inputMode="numeric"
              value={formatPhone(em.employerPhone)}
              onChange={(v) => set("employerPhone", digits(v, 10))}
              error={e.employerPhone}
              placeholder="(555) 123-4567"
            />
          </div>
        </>
      )}

      <SectionTitle title="Your pay" />
      <ChoiceCards
        label="How often are you paid?"
        cols={4}
        value={em.payFrequency}
        onChange={(v) => set("payFrequency", v)}
        options={PAY_FREQUENCIES}
        error={e.payFrequency}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Next pay date"
          type="date"
          min={today}
          value={em.nextPayDate}
          onChange={(v) => set("nextPayDate", v)}
          error={e.nextPayDate}
        />
        <TextField
          label="Monthly take-home pay"
          prefix="$"
          inputMode="numeric"
          value={em.netMonthlyIncome}
          onChange={(v) => set("netMonthlyIncome", digits(v, 7))}
          error={e.netMonthlyIncome}
          hint="After taxes, from all sources."
        />
      </div>
      <SelectField
        label="Main source of income"
        value={em.incomeSource}
        onChange={(v) => set("incomeSource", v)}
        options={INCOME_SOURCES}
        error={e.incomeSource}
      />
    </div>
  );
}
