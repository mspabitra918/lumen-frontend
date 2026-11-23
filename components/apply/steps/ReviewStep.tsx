"use client";

import type { ReactNode } from "react";
import {
  ACCOUNT_AGES,
  ACCOUNT_TYPES,
  BALANCE_BANDS,
  EMPLOYED_STATUSES,
  EMPLOYMENT_STATUSES,
  HOUSING_STATUSES,
  INCOME_SOURCES,
  LOAN_PURPOSES,
  MONTHS,
  PAY_FREQUENCIES,
  labelOf,
} from "../options";
import { CheckRow } from "../fields";
import type { ApplicationFormData } from "../types";
import type { Errors } from "../validation";
import { formatPhone, lastFour, usd } from "../../../lib/loan";

function Card({
  title,
  onEdit,
  rows,
}: {
  title: string;
  onEdit: () => void;
  rows: [string, ReactNode][];
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full px-3 py-1 text-sm font-semibold text-moss hover:bg-cream"
        >
          Edit
        </button>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-ink/45">{k}</dt>
            <dd className="truncate font-medium">{v || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ReviewStep({
  data,
  set,
  errors,
  goTo,
}: {
  data: ApplicationFormData;
  set: <K extends keyof ApplicationFormData["consent"]>(
    f: K,
    v: boolean,
  ) => void;
  errors: Errors;
  goTo: (i: number) => void;
}) {
  const { loan: l, personal: p, employment: em, banking: b, consent: c } = data;
  const employed = EMPLOYED_STATUSES.includes(em.employmentStatus);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Loan"
          onEdit={() => goTo(0)}
          rows={[
            ["Amount", usd(l.amount)],
            ["Term", `${l.loanTerm} months`],
            [
              "Purpose",
              l.purpose === "other"
                ? l.otherPurpose
                : labelOf(LOAN_PURPOSES, l.purpose),
            ],
          ]}
        />
        <Card
          title="Personal"
          onEdit={() => goTo(1)}
          rows={[
            ["Name", `${p.firstName} ${p.lastName}`],
            ["Email", p.email],
            ["Phone", formatPhone(p.phone)],
            [
              "Date of birth",
              `${labelOf(MONTHS, p.dobMonth)} ${p.dobDay}, ${p.dobYear}`,
            ],
            ["SSN", lastFour(p.ssn)],
            ["ID", `${p.dlState} ${lastFour(p.dlNumber)}`],
            [
              "Address",
              `${p.streetAddress}${p.addressLine2 ? `, ${p.addressLine2}` : ""}, ${p.city}, ${p.state} ${p.zip}`,
            ],
            [
              "Housing",
              `${labelOf(HOUSING_STATUSES, p.housingStatus)} · ${usd(p.monthlyHousingCost || 0)}/mo`,
            ],
          ]}
        />
        <Card
          title="Income"
          onEdit={() => goTo(2)}
          rows={[
            ["Status", labelOf(EMPLOYMENT_STATUSES, em.employmentStatus)],
            ...(employed
              ? ([["Employer", `${em.employerName} · ${em.jobTitle}`]] as [
                  string,
                  string,
                ][])
              : []),
            ["Take-home", `${usd(Number(em.netMonthlyIncome) || 0)}/mo`],
            ["Paid", labelOf(PAY_FREQUENCIES, em.payFrequency)],
            ["Next pay date", em.nextPayDate],
            ["Source", labelOf(INCOME_SOURCES, em.incomeSource)],
          ]}
        />
        <Card
          title="Bank"
          onEdit={() => goTo(3)}
          rows={[
            ["Bank", b.bankName],
            ["Type", labelOf(ACCOUNT_TYPES, b.accountType)],
            ["Routing", b.routingNumber],
            ["Account", lastFour(b.accountNumber)],
            ["Open for", labelOf(ACCOUNT_AGES, b.accountAge)],
            ["Balance", labelOf(BALANCE_BANDS, b.currentBalanceBand)],
            [
              "Direct deposit",
              b.directDeposit === null ? "—" : b.directDeposit ? "Yes" : "No",
            ],
          ]}
        />
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-moss">
          Agreements
        </h3>
        <CheckRow
          required
          checked={c.esign}
          onChange={(v) => set("esign", v)}
          error={errors.esign}
        >
          I agree to receive disclosures and sign documents electronically under
          the <u>E-Sign Consent</u>.
        </CheckRow>
        <CheckRow
          required
          checked={c.privacy}
          onChange={(v) => set("privacy", v)}
          error={errors.privacy}
        >
          I have read and agree to the <u>Privacy Policy</u> and{" "}
          <u>Terms of Use</u>.
        </CheckRow>
        <CheckRow
          required
          checked={c.creditPull}
          onChange={(v) => set("creditPull", v)}
          error={errors.creditPull}
        >
          I authorize Lumen to obtain my credit report and verify the
          information I’ve provided.
        </CheckRow>
        <CheckRow checked={c.tcpa} onChange={(v) => set("tcpa", v)}>
          You may contact me by call or text at the number provided, including
          with automated technology. Message &amp; data rates may apply.
        </CheckRow>
      </div>
    </div>
  );
}
