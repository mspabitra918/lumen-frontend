"use client";

import { HOUSING_STATUSES, MONTHS, US_STATES } from "../options";
import {
  ChoiceCards,
  SecretField,
  SectionTitle,
  SelectField,
  TextField,
} from "../fields";
import { digits, formatPhone, formatSSN } from "../../../lib/loan";
import { numText, toNum, type StepProps } from "./shared";

export function PersonalStep({
  value: p,
  set,
  errors: e,
}: StepProps<"personal">) {
  return (
    <div className="space-y-6">
      <SectionTitle title="About you" />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="First name"
          autoComplete="given-name"
          value={p.firstName}
          onChange={(v) => set("firstName", v)}
          error={e.firstName}
        />
        <TextField
          label="Last name"
          autoComplete="family-name"
          value={p.lastName}
          onChange={(v) => set("lastName", v)}
          error={e.lastName}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={p.email}
          onChange={(v) => set("email", v.trim())}
          error={e.email}
          placeholder="you@example.com"
        />
        <TextField
          label="Mobile phone"
          type="tel"
          autoComplete="tel-national"
          inputMode="numeric"
          value={formatPhone(p.phone)}
          onChange={(v) => set("phone", digits(v, 10))}
          error={e.phone}
          placeholder="(555) 123-4567"
        />
      </div>

      <div data-error={e.dob ? "true" : undefined}>
        <p className="mb-2 text-sm font-medium text-ink/80">Date of birth</p>
        <div className="grid grid-cols-[1.6fr_1fr_1.2fr] gap-3">
          <SelectField
            label=""
            placeholder="Month"
            value={p.dobMonth}
            onChange={(v) => set("dobMonth", v)}
            options={MONTHS}
            error={e.dob ? " " : undefined}
          />
          <TextField
            label=""
            placeholder="DD"
            inputMode="numeric"
            value={p.dobDay}
            onChange={(v) => set("dobDay", digits(v, 2))}
            error={e.dob ? " " : undefined}
          />
          <TextField
            label=""
            placeholder="YYYY"
            inputMode="numeric"
            value={p.dobYear}
            onChange={(v) => set("dobYear", digits(v, 4))}
            error={e.dob ? " " : undefined}
          />
        </div>
        {e.dob && (
          <p className="mt-1.5 text-sm text-coral" role="alert">
            {e.dob}
          </p>
        )}
      </div>

      <SectionTitle title="Identity" sub="🔒 Encrypted" />
      <div className="grid gap-5 sm:grid-cols-2">
        <SecretField
          label="Social Security number"
          inputMode="numeric"
          value={formatSSN(p.ssn)}
          onChange={(v) => set("ssn", digits(v, 9))}
          error={e.ssn}
          placeholder="123-45-6789"
          hint="Used for a soft credit check. It won’t affect your score."
          wrapClass="sm:col-span-2"
        />
        <TextField
          label="Driver’s license / state ID #"
          value={p.dlNumber}
          onChange={(v) =>
            set(
              "dlNumber",
              v
                .toUpperCase()
                .replace(/[^A-Z0-9-]/g, "")
                .slice(0, 20),
            )
          }
          error={e.dlNumber}
        />
        <SelectField
          label="Issuing state"
          value={p.dlState}
          onChange={(v) => set("dlState", v)}
          options={US_STATES}
          error={e.dlState}
        />
      </div>

      <SectionTitle title="Home address" />
      <div className="grid gap-5 sm:grid-cols-6">
        <TextField
          label="Street address"
          autoComplete="address-line1"
          value={p.streetAddress}
          onChange={(v) => set("streetAddress", v)}
          error={e.streetAddress}
          wrapClass="sm:col-span-4"
        />
        <TextField
          label="Apt / unit"
          autoComplete="address-line2"
          value={p.addressLine2}
          onChange={(v) => set("addressLine2", v)}
          wrapClass="sm:col-span-2"
          hint="Optional"
        />
        <TextField
          label="City"
          autoComplete="address-level2"
          value={p.city}
          onChange={(v) => set("city", v)}
          error={e.city}
          wrapClass="sm:col-span-3"
        />
        <SelectField
          label="State"
          value={p.state}
          onChange={(v) => set("state", v)}
          options={US_STATES}
          error={e.state}
          wrapClass="sm:col-span-2"
        />
        <TextField
          label="ZIP"
          autoComplete="postal-code"
          inputMode="numeric"
          value={p.zip}
          onChange={(v) => set("zip", digits(v, 5))}
          error={e.zip}
          wrapClass="sm:col-span-1"
        />
      </div>

      <ChoiceCards
        label="Housing"
        cols={5}
        value={p.housingStatus}
        onChange={(v) => set("housingStatus", v)}
        options={HOUSING_STATUSES}
        error={e.housingStatus}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Years at this address"
          inputMode="numeric"
          value={numText(p.yearsAtAddress)}
          onChange={(v) => set("yearsAtAddress", toNum(digits(v, 2)))}
          error={e.yearsAtAddress}
        />
        <TextField
          label="Monthly rent / mortgage"
          prefix="$"
          inputMode="numeric"
          value={numText(p.monthlyHousingCost)}
          onChange={(v) => set("monthlyHousingCost", toNum(digits(v, 6)))}
          error={e.monthlyHousingCost}
          hint="Enter 0 if you don’t pay housing costs."
        />
      </div>
    </div>
  );
}
