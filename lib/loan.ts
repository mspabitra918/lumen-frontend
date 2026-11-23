export const PROFILES = [
  { key: "excellent", label: "Excellent", apr: 10 },
  { key: "good", label: "Good", apr: 10 },
  { key: "fair", label: "Fair", apr: 10 },
] as const;

export function monthlyPayment(
  principal: number,
  aprPct: number,
  months: number,
) {
  const r = aprPct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function loanSummary(principal: number, aprPct: number, months: number) {
  const monthly = monthlyPayment(principal, aprPct, months);
  const total = monthly * months;
  return { monthly, total, interest: total - principal };
}

export const usd = (n: number, cents = true) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });

export const digits = (s: string, max?: number) => {
  const d = s.replace(/\D/g, "");
  return max ? d.slice(0, max) : d;
};

export function formatPhone(d: string) {
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

export function formatSSN(d: string) {
  if (d.length < 4) return d;
  if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5, 9)}`;
}

export const lastFour = (s: string) => (s ? `•••• ${s.slice(-4)}` : "—");

/** Single illustrative APR used for examples across the site. */
export const ILLUSTRATIVE_APR = 10;
