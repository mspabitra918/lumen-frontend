"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { usd } from "@/lib/loan";
import {
  API_URL,
  STATUS_EMAIL_KEY,
  STATUS_STAGES,
  currentStatusDisplay,
  fromBackendApplication,
  site,
  type ApplicationStatus,
  type BackendApplication,
  type StatusTone,
} from "@/lib/status";

const BADGE: Record<StatusTone, string> = {
  progress: "bg-lime/50 text-moss",
  action: "bg-amber-100 text-amber-800",
  success: "bg-lime text-ink",
  declined: "bg-coral/15 text-coral",
};

const PANEL: Record<StatusTone, string> = {
  progress: "border-lime/60 bg-lime/15",
  action: "border-amber-300 bg-amber-50",
  success: "border-lime bg-lime/30",
  declined: "border-coral/30 bg-coral/10",
};

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-lime transition hover:bg-moss disabled:opacity-60";
const btnOutline =
  "inline-flex items-center justify-center rounded-full border border-ink/15 px-7 py-3.5 font-semibold text-ink transition hover:bg-cream";
const inputCls =
  "mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-ink outline-none transition placeholder:text-ink/30 focus:border-ink focus:ring-4 focus:ring-lime/40";

function fmt(iso: string | null, withTime = false) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(
    "en-US",
    withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" },
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-lime border-t-transparent" />
  );
}

export default function LoanStatusLookup({
  initialId = "",
  initialEmail = "",
}: {
  initialId?: string;
  initialEmail?: string;
}) {
  const [id, setId] = useState(initialId.replace(/\D/g, "").slice(0, 5));
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [app, setApp] = useState<ApplicationStatus | null>(null);

  // Prefill the email the applicant just applied with (set by the apply wizard).
  useEffect(() => {
    if (initialEmail) return;
    try {
      const saved = sessionStorage.getItem(STATUS_EMAIL_KEY);
      if (saved) setEmail(saved);
    } catch {}
  }, [initialEmail]);

  async function lookup(e?: FormEvent) {
    e?.preventDefault();
    if (!id.trim() || !email.trim()) {
      setError("Enter your application ID and email.");
      return;
    }
    if (!/^\d{5}$/.test(id)) {
      setError("Your application ID is the 5-digit number from your confirmation email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/api/application-status?${new URLSearchParams({ id, email: email.trim() })}`,
        { cache: "no-store" },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.application) {
        setApp(null);
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setApp(fromBackendApplication(json.application as BackendApplication));
    } catch {
      setError("We couldn't reach our servers. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (app) {
    const display = currentStatusDisplay(app.backendStatus);

    return (
      <div className="animate-rise mx-auto max-w-3xl rounded-3xl border border-ink/10 bg-white p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
              Application <span className="font-mono text-ink">{app.id}</span>
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Hi {app.firstName}, here&apos;s your status.
            </h2>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${BADGE[display.tone]}`}>
            {display.label}
          </span>
        </div>

        {display.stage >= 0 && (
          <ol className="mt-8 grid grid-cols-4 gap-2">
            {STATUS_STAGES.map((s, i) => {
              const funded = display.stage === STATUS_STAGES.length - 1;
              const done = i < display.stage || funded;
              const active = i === display.stage && !funded;
              return (
                <li key={s}>
                  <div
                    className={`h-1.5 rounded-full ${done ? "bg-ink" : active ? "bg-lime" : "bg-ink/10"}`}
                  />
                  <p
                    className={`mt-2 text-xs sm:text-sm ${done || active ? "font-medium text-ink" : "text-ink/40"}`}
                  >
                    {s}
                  </p>
                </li>
              );
            })}
          </ol>
        )}

        <dl className="mt-8 grid gap-4 border-t border-ink/10 pt-6 text-sm sm:grid-cols-2">
          <Row label="Requested" value={usd(app.amount)} />
          <Row label="Term" value={`${app.loanTerm} months`} />
          <Row label="Purpose" value={app.purpose} />
          <Row label="Submitted" value={fmt(app.submittedAt, true)} />
          <Row label="Last updated" value={fmt(app.updatedAt)} />
          {app.fundedAt && <Row label="Funded" value={fmt(app.fundedAt)} />}
        </dl>

        <div className={`mt-8 rounded-2xl border p-5 sm:p-6 ${PANEL[display.tone]}`} role="status">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
            Current status
          </span>
          <strong className="mt-1 block font-display text-2xl font-medium">
            {display.label}
          </strong>
          <p className="mt-2 text-ink/70">
            {display.text}
            {app.backendStatus === "request_a_call" && (
              <>
                {" "}Call us at{" "}
                <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="font-semibold text-ink underline decoration-lime decoration-2 underline-offset-4">
                  {site.phone}
                </a>
                .
              </>
            )}
          </p>
          {display.bankAction && (
            <Link
              href={`${display.bankAction.path}?applicationId=${encodeURIComponent(app.id)}`}
              className={`${btnPrimary} mt-5`}
            >
              {display.bankAction.label}
            </Link>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className={btnPrimary} onClick={() => lookup()} disabled={loading}>
            {loading && <Spinner />}
            {loading ? "Refreshing…" : "Refresh status"}
          </button>
          <button type="button" className={btnOutline} onClick={() => setApp(null)}>
            Look up another
          </button>
        </div>

        <p className="mt-6 text-sm text-ink/50">
          Questions? Call{" "}
          <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="font-semibold text-ink">
            {site.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={lookup}
      noValidate
      className="mx-auto max-w-lg rounded-3xl border border-ink/10 bg-white p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-medium tracking-tight">
        Find your application
      </h2>
      <p className="mt-2 text-sm text-ink/60">
        Use the 5-digit ID from your confirmation email.
      </p>

      <label htmlFor="status-id" className="mt-6 block text-sm font-medium">
        Application ID
      </label>
      <input
        id="status-id"
        className={`${inputCls} font-mono tracking-widest`}
        placeholder="12345"
        inputMode="numeric"
        maxLength={5}
        autoComplete="off"
        value={id}
        onChange={(e) => setId(e.target.value.replace(/\D/g, "").slice(0, 5))}
      />

      <label htmlFor="status-email" className="mt-4 block text-sm font-medium">
        Email address
      </label>
      <input
        id="status-email"
        className={inputCls}
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && (
        <p className="mt-5 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={`${btnPrimary} mt-6 w-full py-4`} disabled={loading}>
        {loading && <Spinner />}
        {loading ? "Checking…" : "Check Status"}
      </button>

      <p className="mt-5 text-center text-sm text-ink/50">
        Haven&apos;t applied yet?{" "}
        <Link href="/apply" className="font-semibold text-ink underline decoration-lime decoration-2 underline-offset-4">
          Start an application
        </Link>
        .
      </p>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 sm:block">
      <dt className="text-ink/50">{label}</dt>
      <dd className="font-medium sm:mt-1">{value}</dd>
    </div>
  );
}
