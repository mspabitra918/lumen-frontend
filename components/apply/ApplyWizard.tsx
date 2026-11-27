"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  emptyApplication,
  type ApplicationFormData,
  type FieldOf,
  type Section,
} from "./types";
import { validateSection, SECTIONS, type Errors } from "./validation";
import { LOAN_PURPOSES, labelOf } from "./options";
import { LoanStep } from "./steps/LoanStep";
import { PersonalStep } from "./steps/PersonalStep";
import { EmploymentStep } from "./steps/EmploymentStep";
import { BankingStep } from "./steps/BankingStep";
import { ReviewStep } from "./steps/ReviewStep";
import { loanSummary, usd } from "@/lib/loan";
import { Logo } from "../site/Logo";
import { STATUS_EMAIL_KEY } from "@/lib/status";

const STEPS: { key: Section; label: string; title: string; sub: string }[] = [
  {
    key: "loan",
    label: "Loan",
    title: "Let’s start with the basics.",
    sub: "Pick an amount and term. You can change these later.",
  },
  {
    key: "personal",
    label: "About you",
    title: "Tell us about yourself.",
    sub: "We use this to verify your identity. It’s a soft check.",
  },
  {
    key: "employment",
    label: "Income",
    title: "How do you get paid?",
    sub: "This helps us find a payment that fits your budget.",
  },
  {
    key: "banking",
    label: "Bank",
    title: "Where should we send the money?",
    sub: "Funds are deposited directly into this account.",
  },
  {
    key: "consent",
    label: "Review",
    title: "Look it over, then submit.",
    sub: "Make sure everything’s right before you send it in.",
  },
];

type Result = { applicationId: string; status: string };

export function ApplyWizard({
  initialAmount,
  initialTerm,
}: {
  initialAmount?: number;
  initialTerm?: number;
}) {
  const [data, setData] = useState<ApplicationFormData>(() =>
    emptyApplication(initialAmount, initialTerm),
  );
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [attempted, setAttempted] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<{
    message: string;
    applicationId?: string;
  } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const current = STEPS[step];
  const liveErrors = useMemo(
    () => validateSection(current.key, data),
    [current.key, data],
  );
  const errors: Errors = attempted[step] ? liveErrors : {};

  const setField = useCallback(
    <S extends Section>(section: S) =>
      <K extends FieldOf<S>>(field: K, v: ApplicationFormData[S][K]) =>
        setData((d) => ({ ...d, [section]: { ...d[section], [field]: v } })),
    [],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(
        '[data-error="true"]',
      );
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector<HTMLElement>("input,select,button")?.focus({
        preventScroll: true,
      });
    });

  const goTo = (i: number) => {
    if (i <= maxReached) setStep(i);
  };

  async function next() {
    setAttempted((a) => ({ ...a, [step]: true }));
    if (Object.keys(liveErrors).length) return focusFirstError();

    if (step < STEPS.length - 1) {
      const n = step + 1;
      setStep(n);
      setMaxReached((m) => Math.max(m, n));
      return;
    }

    // Final submit: re-check every section in case something was edited out of order.
    const bad = SECTIONS.findIndex(
      (s) => Object.keys(validateSection(s, data)).length,
    );
    if (bad !== -1) {
      setAttempted((a) => ({ ...a, [bad]: true }));
      setStep(bad);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/apply/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json?.applicationId) rememberEmail(data.personal.email);
        setSubmitError({
          message: json?.message ?? "Something went wrong. Please try again.",
          applicationId: json?.applicationId,
        });
        return;
      }
      rememberEmail(data.personal.email);
      setResult(json);
    } catch {
      setSubmitError({ message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const est =
    Number.isFinite(data.loan.amount) && data.loan.amount > 0
      ? loanSummary(data.loan.amount, 10, data.loan.loanTerm)
      : null;
  const progress = ((step + (result ? 1 : 0)) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[400px_1fr]">
      {/* Sidebar */}
      <aside className="grain relative overflow-hidden bg-ink text-white lg:sticky lg:top-0 lg:h-screen">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-lime/20 blur-[100px]"
        />
        <div className="relative flex h-full flex-col px-6 py-6 lg:px-10 lg:py-10">
          <div className="flex items-center justify-between">
            <Logo />
            <Link
              href="/"
              className="text-sm text-white/50 hover:text-white lg:hidden"
            >
              Exit
            </Link>
          </div>

          {/* Mobile progress */}
          <div className="mt-6 lg:hidden">
            <div className="flex justify-between text-xs text-white/60">
              <span>
                Step {step + 1} of {STEPS.length} · {current.label}
              </span>
              {est && (
                <span className="text-lime">
                  {usd(data.loan.amount)} · {data.loan.loanTerm} mo
                </span>
              )}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-lime transition-all duration-500"
                style={{ width: `${Math.max(progress, 6)}%` }}
              />
            </div>
          </div>

          {/* Desktop steps */}
          <ol className="mt-16 hidden space-y-1 lg:block">
            {STEPS.map((s, i) => {
              const done = i < step || !!result;
              const active = i === step && !result;
              const reachable = i <= maxReached && !result;
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    disabled={!reachable}
                    onClick={() => goTo(i)}
                    className={`group flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-white/10"
                        : reachable
                          ? "hover:bg-white/5"
                          : ""
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold transition ${
                        done
                          ? "bg-lime text-ink"
                          : active
                            ? "bg-white text-ink"
                            : "border border-white/20 text-white/40"
                      }`}
                    >
                      {done ? (
                        <svg
                          viewBox="0 0 20 20"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M5 10l3 3 7-7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span
                      className={
                        active
                          ? "font-semibold text-white"
                          : done
                            ? "text-white/80"
                            : "text-white/40"
                      }
                    >
                      {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {est && (
            <div className="mt-auto hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:block">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                Your request
              </p>
              <p className="mt-2 font-display text-4xl font-semibold">
                {usd(data.loan.amount)}
              </p>
              <p className="mt-1 text-sm text-white/60">
                {data.loan.loanTerm} months
                {data.loan.purpose &&
                  ` · ${labelOf(LOAN_PURPOSES, data.loan.purpose)}`}
              </p>
              <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                <span className="text-sm text-white/50">Est. monthly</span>
                <span className="font-display text-2xl font-semibold text-lime">
                  {usd(est.monthly, true)}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-white/35">
                Illustrative at 10% APR.
              </p>
            </div>
          )}
          <p className="mt-6 hidden items-center gap-2 text-xs text-white/40 lg:flex">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
            256-bit encryption · Won’t affect your credit score
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="px-5 py-10 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 hidden justify-end lg:flex">
            <Link href="/" className="text-sm text-ink/50 hover:text-ink">
              Save &amp; exit ✕
            </Link>
          </div>

          {result ? (
            <Success result={result} data={data} />
          ) : (
            <div key={step} className="animate-rise">
              <p className="text-sm font-semibold text-moss">
                Step {step + 1} of {STEPS.length}
              </p>
              <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                {current.title}
              </h1>
              <p className="mt-3 text-ink/55">{current.sub}</p>

              {attempted[step] && Object.keys(liveErrors).length > 0 && (
                <div
                  className="mt-6 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-ink"
                  role="alert"
                >
                  Please fix the{" "}
                  {Object.keys(liveErrors).length === 1
                    ? "highlighted field"
                    : `${Object.keys(liveErrors).length} highlighted fields`}{" "}
                  to continue.
                </div>
              )}

              <div ref={formRef} className="mt-10">
                {current.key === "loan" && (
                  <LoanStep
                    value={data.loan}
                    set={setField("loan")}
                    errors={errors}
                  />
                )}
                {current.key === "personal" && (
                  <PersonalStep
                    value={data.personal}
                    set={setField("personal")}
                    errors={errors}
                  />
                )}
                {current.key === "employment" && (
                  <EmploymentStep
                    value={data.employment}
                    set={setField("employment")}
                    errors={errors}
                  />
                )}
                {current.key === "banking" && (
                  <BankingStep
                    value={data.banking}
                    set={setField("banking")}
                    errors={errors}
                  />
                )}
                {current.key === "consent" && (
                  <ReviewStep
                    data={data}
                    set={setField("consent")}
                    errors={errors}
                    goTo={goTo}
                  />
                )}
              </div>

              {submitError && (
                <div
                  className="mt-6 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm"
                  role="alert"
                >
                  {submitError.message}
                  {submitError.applicationId && (
                    <>
                      {" "}
                      <Link
                        href={`/track-loan?id=${encodeURIComponent(submitError.applicationId)}`}
                        className="font-semibold underline decoration-coral decoration-2 underline-offset-4"
                      >
                        Check its status →
                      </Link>
                    </>
                  )}
                </div>
              )}

              <div className="sticky bottom-0 -mx-5 mt-12 flex items-center justify-between gap-4 border-t border-ink/10 bg-paper/90 px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-none">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className={`rounded-full px-5 py-3.5 font-medium text-ink/70 transition hover:bg-cream ${step === 0 ? "invisible" : ""}`}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={submitting}
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-semibold text-lime transition hover:bg-moss disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-lime border-t-transparent" />
                      Submitting…
                    </>
                  ) : step === STEPS.length - 1 ? (
                    "Submit application"
                  ) : (
                    <>
                      Continue
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4 transition group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M4 10h12M11 5l5 5-5 5" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Success({
  result,
  data,
}: {
  result: Result;
  data: ApplicationFormData;
}) {
  return (
    <div className="animate-rise text-center">
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-lime shadow-[0_0_0_12px_rgb(200_241_105/0.25)]">
        <svg
          viewBox="0 0 24 24"
          className="h-12 w-12 text-ink"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h1 className="mt-10 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        You’re all set, {data.personal.firstName}.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-ink/60">
        We’ve received your application for{" "}
        <strong className="text-ink">{usd(data.loan.amount)}</strong> over{" "}
        {data.loan.loanTerm} months. We’ll email{" "}
        <strong className="text-ink">{data.personal.email}</strong> as soon as
        your decision is ready, usually within minutes.
      </p>
      <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-ink/10 bg-white p-6 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-ink/50">Application ID</span>
          <span className="font-mono font-semibold">
            {result.applicationId}
          </span>
        </div>
        <div className="mt-3 flex justify-between text-sm">
          <span className="text-ink/50">Status</span>
          <span className="rounded-full bg-lime/50 px-2.5 py-0.5 text-xs font-semibold capitalize text-moss">
            {result.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href={`/track-loan?id=${encodeURIComponent(result.applicationId)}`}
          className="inline-flex rounded-full bg-ink px-8 py-4 font-semibold text-lime hover:bg-moss"
        >
          Track my application
        </Link>
        <Link
          href="/"
          className="inline-flex rounded-full px-8 py-4 font-semibold text-ink/70 hover:bg-cream"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function rememberEmail(email: string) {
  try {
    sessionStorage.setItem(STATUS_EMAIL_KEY, email);
  } catch {}
}
