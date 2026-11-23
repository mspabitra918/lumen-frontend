// Shared by the wizard (per step) and the API route (whole payload).
import { EMPLOYED_STATUSES, LOAN_TERMS } from "./options";
import { MAX_AMOUNT, MIN_AMOUNT, type ApplicationFormData, type Section } from "./types";

export type Errors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);
const blank = (s: unknown) => typeof s !== "string" || s.trim() === "";

/** ABA routing number checksum. */
export function validRouting(r: string) {
  if (!/^\d{9}$/.test(r)) return false;
  const d = r.split("").map(Number);
  const sum = 3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + (d[2] + d[5] + d[8]);
  return sum % 10 === 0;
}

function ageOn(y: number, m: number, d: number, now = new Date()) {
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age--;
  return age;
}

function validDate(y: number, m: number, d: number) {
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export function validateSection(section: Section, data: ApplicationFormData): Errors {
  const e: Errors = {};

  if (section === "loan") {
    const l = data.loan;
    if (!isNum(l.amount) || l.amount < MIN_AMOUNT || l.amount > MAX_AMOUNT)
      e.amount = `Choose an amount between $${MIN_AMOUNT.toLocaleString()} and $${MAX_AMOUNT.toLocaleString()}.`;
    else if (!Number.isInteger(l.amount)) e.amount = "Use whole dollars.";
    if (!LOAN_TERMS.some((t) => t.value === l.loanTerm)) e.loanTerm = "Pick a repayment term.";
    if (blank(l.purpose)) e.purpose = "Tell us what the loan is for.";
    if (l.purpose === "other" && blank(l.otherPurpose)) e.otherPurpose = "Briefly describe the purpose.";
  }

  if (section === "personal") {
    const p = data.personal;
    if (blank(p.firstName)) e.firstName = "Required.";
    if (blank(p.lastName)) e.lastName = "Required.";
    if (!EMAIL.test(p.email ?? "")) e.email = "Enter a valid email address.";
    if (!/^\d{10}$/.test(p.phone ?? "")) e.phone = "Enter a 10-digit phone number.";

    const y = Number(p.dobYear), m = Number(p.dobMonth), d = Number(p.dobDay);
    if (!p.dobMonth || !p.dobDay || !p.dobYear || !validDate(y, m, d) || y < 1900) e.dob = "Enter a valid date of birth.";
    else if (ageOn(y, m, d) < 18) e.dob = "You must be at least 18 to apply.";

    if (!/^\d{9}$/.test(p.ssn ?? "")) e.ssn = "Enter your 9-digit SSN.";
    else if (/^(000|666|9)/.test(p.ssn) || p.ssn.slice(3, 5) === "00" || p.ssn.slice(5) === "0000")
      e.ssn = "That doesn’t look like a valid SSN.";

    if (blank(p.dlNumber)) e.dlNumber = "Required.";
    if (blank(p.dlState)) e.dlState = "Select the issuing state.";
    if (blank(p.streetAddress)) e.streetAddress = "Required.";
    if (blank(p.city)) e.city = "Required.";
    if (blank(p.state)) e.state = "Required.";
    if (!/^\d{5}$/.test(p.zip ?? "")) e.zip = "5-digit ZIP.";
    if (!isNum(p.yearsAtAddress) || p.yearsAtAddress < 0 || p.yearsAtAddress > 99) e.yearsAtAddress = "Enter years (0–99).";
    if (blank(p.housingStatus)) e.housingStatus = "Select one.";
    if (!isNum(p.monthlyHousingCost) || p.monthlyHousingCost < 0) e.monthlyHousingCost = "Enter an amount (0 if none).";
  }

  if (section === "employment") {
    const em = data.employment;
    if (blank(em.employmentStatus)) e.employmentStatus = "Select your employment status.";
    if (EMPLOYED_STATUSES.includes(em.employmentStatus)) {
      if (blank(em.employerName)) e.employerName = "Required.";
      if (blank(em.jobTitle)) e.jobTitle = "Required.";
      if (!isNum(em.employmentLengthMo) || em.employmentLengthMo < 0 || em.employmentLengthMo > 720)
        e.employmentLengthMo = "Enter months (0–720).";
      if (!/^\d{10}$/.test(em.employerPhone ?? "")) e.employerPhone = "Enter a 10-digit phone number.";
    }
    if (blank(em.payFrequency)) e.payFrequency = "Select how often you’re paid.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(em.nextPayDate ?? "")) e.nextPayDate = "Pick your next pay date.";
    else {
      const today = new Date().toISOString().slice(0, 10);
      if (em.nextPayDate < today) e.nextPayDate = "Next pay date can’t be in the past.";
    }
    const inc = Number(em.netMonthlyIncome);
    if (blank(em.netMonthlyIncome) || !Number.isFinite(inc) || inc <= 0) e.netMonthlyIncome = "Enter your monthly take-home pay.";
    if (blank(em.incomeSource)) e.incomeSource = "Select your main income source.";
  }

  if (section === "banking") {
    const b = data.banking;
    if (blank(b.bankName)) e.bankName = "Required.";
    if (blank(b.accountType)) e.accountType = "Select an account type.";
    if (!validRouting(b.routingNumber ?? "")) e.routingNumber = "Enter a valid 9-digit routing number.";
    if (!/^\d{4,17}$/.test(b.accountNumber ?? "")) e.accountNumber = "Enter 4–17 digits.";
    if (b.confirmAccountNumber !== b.accountNumber || blank(b.confirmAccountNumber))
      e.confirmAccountNumber = "Account numbers don’t match.";
    if (blank(b.accountAge)) e.accountAge = "Select one.";
    if (blank(b.currentBalanceBand)) e.currentBalanceBand = "Select one.";
    if (typeof b.directDeposit !== "boolean") e.directDeposit = "Select yes or no.";
  }

  if (section === "consent") {
    const c = data.consent;
    if (!c.esign) e.esign = "Required to continue.";
    if (!c.privacy) e.privacy = "Required to continue.";
    if (!c.creditPull) e.creditPull = "Required to continue.";
  }

  return e;
}

export const SECTIONS: Section[] = ["loan", "personal", "employment", "banking", "consent"];

export function validateApplication(data: ApplicationFormData) {
  const all: Record<string, Errors> = {};
  for (const s of SECTIONS) {
    const e = validateSection(s, data);
    if (Object.keys(e).length) all[s] = e;
  }
  return all;
}
