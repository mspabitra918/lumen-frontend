// Option codes are what the backend stores; labels are display-only.

export type Option<V extends string | number = string> = { value: V; label: string; hint?: string };

export const LOAN_TERMS: Option<number>[] = [
  { value: 12, label: "12 months" },
  { value: 24, label: "24 months" },
  { value: 36, label: "36 months" },
  { value: 48, label: "48 months" },
];

export const LOAN_PURPOSES: Option[] = [
  { value: "debt_consolidation", label: "Debt consolidation" },
  { value: "credit_card_refi", label: "Credit card refinancing/payoff" },
  { value: "home_improvement", label: "Home improvement/repairs" },
  { value: "emergency", label: "Emergency expenses" },
  { value: "medical", label: "Medical or dental bills" },
  { value: "major_purchase", label: "Major purchase" },
  { value: "auto", label: "Auto repair or car expenses" },
  { value: "moving", label: "Moving or relocation" },
  { value: "rent_utilities", label: "Rent or utilities catch-up" },
  { value: "bills", label: "Bill payments" },
  { value: "travel", label: "Vacation or travel" },
  { value: "wedding", label: "Wedding expenses" },
  { value: "education", label: "Education or tuition" },
  { value: "business", label: "Business expenses" },
  { value: "family_childcare", label: "Family or childcare expenses" },
  { value: "funeral", label: "Funeral or bereavement costs" },
  { value: "taxes", label: "Tax payments" },
  { value: "pet", label: "Pet or veterinary expenses" },
  { value: "holiday", label: "Holiday or seasonal spending" },
  { value: "other", label: "Other" },
];

export const US_STATES: Option[] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"],
  ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"],
  ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"],
  ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"],
  ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
  ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"],
  ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
  ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"],
  ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
].map(([value, label]) => ({ value, label }));

export const MONTHS: Option[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
].map((label, i) => ({ value: String(i + 1).padStart(2, "0"), label }));

export const HOUSING_STATUSES: Option[] = [
  { value: "rent", label: "Rent" },
  { value: "own_mortgage", label: "Own with mortgage" },
  { value: "own_outright", label: "Own outright" },
  { value: "family", label: "Live with family" },
  { value: "other", label: "Other" },
];

export const EMPLOYMENT_STATUSES: Option[] = [
  { value: "full_time", label: "Employed full-time" },
  { value: "part_time", label: "Employed part-time" },
  { value: "self_employed", label: "Self-employed" },
  { value: "contract", label: "Contract / gig work" },
  { value: "retired", label: "Retired" },
  { value: "benefits", label: "Receiving benefits" },
  { value: "unemployed", label: "Not currently employed" },
];

/** Statuses that have an employer (or business) to describe. */
export const EMPLOYED_STATUSES = ["full_time", "part_time", "self_employed", "contract"];

export const PAY_FREQUENCIES: Option[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "semimonthly", label: "Twice a month" },
  { value: "monthly", label: "Monthly" },
];

export const INCOME_SOURCES: Option[] = [
  { value: "employment", label: "Employment wages" },
  { value: "self_employment", label: "Self-employment" },
  { value: "social_security", label: "Social Security" },
  { value: "disability", label: "Disability" },
  { value: "pension", label: "Pension / retirement" },
  { value: "military", label: "Military" },
  { value: "other", label: "Other" },
];

export const ACCOUNT_TYPES: Option[] = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
];

export const ACCOUNT_AGES: Option[] = [
  { value: "lt_3m", label: "Less than 3 months" },
  { value: "3_6m", label: "3–6 months" },
  { value: "6_12m", label: "6–12 months" },
  { value: "1_2y", label: "1–2 years" },
  { value: "gt_2y", label: "More than 2 years" },
];

export const BALANCE_BANDS: Option[] = [
  { value: "lt_100", label: "Under $100" },
  { value: "100_500", label: "$100 – $500" },
  { value: "500_1000", label: "$500 – $1,000" },
  { value: "1000_5000", label: "$1,000 – $5,000" },
  { value: "gt_5000", label: "Over $5,000" },
];

export function labelOf<V extends string | number>(options: Option<V>[], value: V | null | undefined) {
  return options.find((o) => o.value === value)?.label ?? "—";
}
