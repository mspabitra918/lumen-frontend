import { LOAN_PURPOSES } from "@/components/apply/options";

/** Base URL of the Express backend (lumen-backend), called from the browser. */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001"
).replace(/\/+$/, "");

export const site = { phone: "1-800-555-0199" };

/** Hand-off from the apply wizard so the email doesn't have to travel in the URL. */
export const STATUS_EMAIL_KEY = "lumen:status-email";

/** Row returned by the backend's GET /api/application-status. */
export type BackendApplication = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  loan_amount: number | string;
  loan_purpose: string;
  loan_term: number | string;
  status: string;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  funded_at: string | null;
};

export type ApplicationStatus = {
  id: string;
  firstName: string;
  amount: number;
  loanTerm: number;
  purpose: string;
  submittedAt: string;
  updatedAt: string;
  fundedAt: string | null;
  backendStatus: string;
};

export function fromBackendApplication(a: BackendApplication): ApplicationStatus {
  return {
    id: a.id,
    firstName: a.first_name,
    amount: Number(a.loan_amount),
    loanTerm: Number(a.loan_term),
    purpose:
      LOAN_PURPOSES.find((o) => o.value === a.loan_purpose)?.label ??
      (a.loan_purpose || "—"),
    submittedAt: a.created_at,
    updatedAt: a.updated_at,
    fundedAt: a.funded_at,
    backendStatus: a.status,
  };
}

export type StatusTone = "progress" | "action" | "success" | "declined";

export type StatusDisplay = {
  label: string;
  tone: StatusTone;
  text: string;
  /** Index into STATUS_STAGES; -1 hides the progress bar. */
  stage: number;
  /** The backend's emails send applicants to these same pages. */
  bankAction?: { path: string; label: string };
};

export const STATUS_STAGES = ["Submitted", "Bank verified", "In review", "Funded"];

const DECLINED: StatusDisplay = {
  label: "Not approved",
  tone: "declined",
  stage: -1,
  text: "We weren’t able to approve your application this time. We’ve emailed you the details, and you can reapply after 90 days.",
};

// One entry per value in the backend's APPLICATION_STATUSES.
const DISPLAY: Record<string, StatusDisplay> = {
  // Only bank_reverification asks the applicant to act (reconnect their bank).
  // Every other in-progress status shows a "we’re working on it" message.
  bank_reverification: {
    label: "Action needed",
    tone: "action",
    stage: 1,
    text: "We couldn’t confirm your bank details. Please reconnect your bank account so we can keep reviewing your application.",
    bankAction: { path: "/reconnect-bank-verification", label: "Reconnect my bank" },
  },
  bank_verification_pending: {
    label: "In progress",
    tone: "progress",
    stage: 1,
    text: "Thanks — we’ve received your application and we’re working on it. We’ll email you the moment there’s an update or if we need anything from you.",
  },
  bank_verification_completed: {
    label: "Under review",
    tone: "progress",
    stage: 2,
    text: "Your bank is verified and our team is reviewing your application. We’ll email you as soon as there’s a decision.",
  },
  request_a_call: {
    label: "Let’s talk",
    tone: "action",
    stage: 2,
    text: "A loan specialist needs to confirm a few details with you.",
  },
  funded: {
    label: "Funded",
    tone: "success",
    stage: 3,
    text: "Your loan has been funded. Funds typically arrive in your account within 1 business day.",
  },
  declined_pb: DECLINED,
  declined_hd: DECLINED,
};

export function currentStatusDisplay(status: string): StatusDisplay {
  return (
    DISPLAY[status] ?? {
      label: status.replace(/_/g, " "),
      tone: "progress",
      stage: 0,
      text: "Your application is on file. We’ll email you with any updates.",
    }
  );
}
