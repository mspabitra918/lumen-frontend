"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Landmark,
  Loader2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { companyContact } from "@/components/CompanyContact";
import { STATUS_EMAIL_KEY } from "@/lib/status";
import {
  type ApplicationStatusResult,
  type StatusTone,
  getStatusContent,
  lookupApplicationStatus,
} from "@/app/track-loan/applicationStatus";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const tonePanel: Record<StatusTone, string> = {
  action: "border-amber-300 bg-amber-50",
  progress: "border-lime/60 bg-lime/15",
  success: "border-lime bg-lime/30",
  declined: "border-coral/30 bg-coral/10",
};

const toneBadge: Record<StatusTone, string> = {
  action: "bg-amber-100 text-amber-800",
  progress: "bg-lime/50 text-moss",
  success: "bg-lime text-ink",
  declined: "bg-coral/15 text-coral",
};

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-lime transition hover:bg-moss disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime/50";
const btnOutline =
  "inline-flex items-center justify-center rounded-full border border-ink/15 px-7 py-3.5 font-semibold text-ink transition hover:bg-cream focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime/50";
const inputCls =
  "mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-ink outline-none transition placeholder:text-ink/30 focus:border-ink focus:ring-4 focus:ring-lime/40 aria-[invalid=true]:border-coral";
const linkCls =
  "font-semibold text-ink underline decoration-lime decoration-2 underline-offset-4";

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TrackingSearch() {
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email");
  // Emails link with ?applicationId=…; the apply wizard and bank pages use ?id=…
  const queryApplicationId =
    searchParams.get("applicationId") ??
    searchParams.get("applicationid") ??
    searchParams.get("id");
  const [email, setEmail] = useState(queryEmail ?? "");
  const [applicationId, setApplicationId] = useState(
    (queryApplicationId ?? "").replace(/\D/g, "").slice(0, 5),
  );
  const [validationError, setValidationError] = useState("");
  const [validationField, setValidationField] = useState<
    "email" | "applicationId" | null
  >(null);
  const [loading, setLoading] = useState(() =>
    Boolean(queryEmail && queryApplicationId),
  );
  const [result, setResult] = useState<ApplicationStatusResult | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const applicationIdRef = useRef<HTMLInputElement>(null);

  // Prefill the email the applicant just applied with (set by the apply wizard).
  useEffect(() => {
    if (queryEmail) return;
    try {
      const saved = sessionStorage.getItem(STATUS_EMAIL_KEY);
      if (saved) setEmail(saved);
    } catch {}
  }, [queryEmail]);

  async function runLookup(rawEmail: string, rawId: string) {
    const normalizedEmail = rawEmail.trim();
    const normalizedId = rawId.trim();
    if (
      !normalizedEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      setValidationError("Enter a valid email address to continue.");
      setValidationField("email");
      emailRef.current?.focus();
      return;
    }

    if (!/^\d{5}$/.test(normalizedId)) {
      setValidationError("Enter your 5-digit application ID to continue.");
      setValidationField("applicationId");
      applicationIdRef.current?.focus();
      return;
    }

    setValidationError("");
    setValidationField(null);
    setLoading(true);
    try {
      const application = await lookupApplicationStatus(
        normalizedId,
        normalizedEmail,
      );
      setResult(application);
      setEmail("");
      setApplicationId("");
    } catch (error) {
      setValidationError(
        error instanceof Error
          ? error.message
          : "We couldn't retrieve your application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  // Support deep links like /track-loan?email=...&applicationId=...
  useEffect(() => {
    if (!queryEmail || !queryApplicationId) return;
    let cancelled = false;
    lookupApplicationStatus(queryApplicationId.trim(), queryEmail.trim())
      .then((application) => {
        if (!cancelled) setResult(application);
      })
      .catch((error) => {
        if (!cancelled) {
          setValidationError(
            error instanceof Error
              ? error.message
              : "We couldn't retrieve your application. Please try again.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queryEmail, queryApplicationId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runLookup(email, applicationId);
  }

  function searchAgain() {
    setResult(null);
    setValidationError("");
    setValidationField(null);
    setEmail("");
    setApplicationId("");
    // The form re-mounts on the next render; focus it then.
    requestAnimationFrame(() => emailRef.current?.focus());
  }

  if (result) {
    const content = getStatusContent(result.status);
    const submitted = formatDate(result.created_at);
    const updated = formatDate(result.updated_at);

    return (
      <section
        aria-live="polite"
        aria-labelledby="status-result-title"
        className="animate-rise mx-auto max-w-3xl rounded-3xl border border-ink/10 bg-white p-6 sm:p-10"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
              Application <span className="font-mono text-ink">#{result.id}</span>
            </p>
            <h2
              id="status-result-title"
              className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl"
            >
              {result.first_name ? `Hi ${result.first_name}, ` : ""}
              {content.tone === "declined"
                ? "here’s your application update."
                : "here’s where your application stands."}
            </h2>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${toneBadge[content.tone]}`}
          >
            {result.status?.replace(/_/g, " ") || "—"}
          </span>
        </div>

        <dl className="mt-8 grid gap-4 border-t border-ink/10 pt-6 text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-4 sm:block">
            <dt className="text-ink/50">Requested amount</dt>
            <dd className="font-medium sm:mt-1">
              {currency.format(Number(result.loan_amount))}
            </dd>
          </div>
          <div className="flex justify-between gap-4 sm:block">
            <dt className="text-ink/50">Submitted</dt>
            <dd className="font-medium sm:mt-1">{submitted ?? "—"}</dd>
          </div>
        </dl>

        <div
          className={`mt-8 rounded-2xl border p-5 sm:p-6 ${tonePanel[content.tone]}`}
          role="status"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
            Current status
          </span>
          <strong className="mt-1 block font-display text-2xl font-medium">
            {content.title}
          </strong>
          <p className="mt-2 text-ink/70">{content.description}</p>

          {content.action && (
            <Link
              href={content.action.href(result.id)}
              className={`${btnPrimary} mt-5`}
            >
              <Landmark className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              {content.action.label}
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </Link>
          )}

          {(result.status === "bank_verification_completed" ||
            result.status === "request_a_call") && (
            <p className="mt-4 text-ink/70">
              Please call{" "}
              <a href={companyContact.phones.local.href} className={linkCls}>
                {companyContact.phones.local.display}
              </a>
              .
            </p>
          )}

          {content.tone === "declined" && (
            <p className="mt-4 text-ink/70">
              Email{" "}
              <a href={companyContact.email.href} className={linkCls}>
                {companyContact.email.display}
              </a>{" "}
              or call{" "}
              <a href={companyContact.phones.local.href} className={linkCls}>
                {companyContact.phones.local.display}
              </a>
              .
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink/50">
            {updated ? `Last updated ${updated}` : ""}
          </p>
          <button type="button" onClick={searchAgain} className={btnOutline}>
            Look up another application
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
        Secure application lookup
      </p>
      <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
        Check your application status
      </h2>
      <p className="mt-2 text-sm text-ink/60">
        Enter the email you applied with and the application ID from your
        confirmation.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <label htmlFor="tracking-email" className="block text-sm font-medium">
          Email address
        </label>
        <input
          ref={emailRef}
          id="tracking-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setValidationError("");
            setValidationField(null);
          }}
          aria-invalid={validationField === "email"}
          placeholder="you@example.com"
          className={inputCls}
        />

        <label
          htmlFor="tracking-application-id"
          className="mt-4 block text-sm font-medium"
        >
          Application ID
        </label>
        <input
          ref={applicationIdRef}
          id="tracking-application-id"
          name="applicationId"
          type="text"
          inputMode="numeric"
          pattern="\d{5}"
          maxLength={5}
          autoComplete="off"
          required
          value={applicationId}
          onChange={(event) => {
            setApplicationId(event.target.value.replace(/\D/g, ""));
            setValidationError("");
            setValidationField(null);
          }}
          aria-invalid={validationField === "applicationId"}
          aria-describedby="tracking-id-hint"
          placeholder="12345"
          className={`${inputCls} font-mono tracking-widest`}
        />
        <p id="tracking-id-hint" className="mt-2 text-xs text-ink/50">
          Your 5-digit ID is in your application confirmation email.
        </p>

        {validationError && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm"
          >
            {validationError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`${btnPrimary} mt-6 w-full py-4`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Search className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          )}
          {loading ? "Checking…" : "Track my application"}
          {!loading && (
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>

        <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-ink/50">
          <ShieldCheck className="h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
          Your details are sent over a secure connection and only used to find
          your application.
        </p>
      </form>
    </div>
  );
}
