"use client";

import { ACCOUNT_AGES, ACCOUNT_TYPES, BALANCE_BANDS } from "../options";
import {
  ChoiceCards,
  SecretField,
  SectionTitle,
  SelectField,
  TextField,
} from "../fields";
import { digits } from "../../../lib/loan";
import type { StepProps } from "./shared";

export function BankingStep({
  value: b,
  set,
  errors: e,
}: StepProps<"banking">) {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 rounded-2xl bg-ink p-5 text-sm text-white/75">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime text-ink">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
          </svg>
        </span>
        <p>
          <span className="font-semibold text-white">
            This is where we send your money.
          </span>{" "}
          Account details are encrypted and only used to deposit funds and set
          up your payments.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Bank name"
          value={b.bankName}
          onChange={(v) => set("bankName", v)}
          error={e.bankName}
          placeholder="e.g. Chase"
          wrapClass="sm:col-span-2"
        />
      </div>
      <ChoiceCards
        label="Account type"
        value={b.accountType}
        onChange={(v) => set("accountType", v)}
        options={ACCOUNT_TYPES}
        error={e.accountType}
      />

      <SectionTitle
        title="Account numbers"
        sub="Find these on a check or in your banking app"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Routing number"
          inputMode="numeric"
          value={b.routingNumber}
          onChange={(v) => set("routingNumber", digits(v, 9))}
          error={e.routingNumber}
          placeholder="9 digits"
          wrapClass="sm:col-span-2"
        />
        <SecretField
          label="Account number"
          inputMode="numeric"
          value={b.accountNumber}
          onChange={(v) => set("accountNumber", digits(v, 17))}
          error={e.accountNumber}
        />
        <SecretField
          label="Confirm account number"
          inputMode="numeric"
          value={b.confirmAccountNumber}
          onChange={(v) => set("confirmAccountNumber", digits(v, 17))}
          error={e.confirmAccountNumber}
          onPaste={(ev) => ev.preventDefault()}
          hint="Re-type it, no pasting."
        />
      </div>

      <SectionTitle title="A bit about the account" />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="How long have you had it?"
          value={b.accountAge}
          onChange={(v) => set("accountAge", v)}
          options={ACCOUNT_AGES}
          error={e.accountAge}
        />
        <SelectField
          label="Current balance"
          value={b.currentBalanceBand}
          onChange={(v) => set("currentBalanceBand", v)}
          options={BALANCE_BANDS}
          error={e.currentBalanceBand}
        />
      </div>
      <ChoiceCards
        label="Is your paycheck direct-deposited here?"
        value={b.directDeposit}
        onChange={(v) => set("directDeposit", v)}
        options={[
          { value: true, label: "Yes" },
          { value: false, label: "No" },
        ]}
        error={e.directDeposit}
      />
    </div>
  );
}
