"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import type { Option } from "./options";

const base =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-ink outline-none transition placeholder:text-ink/30 focus:ring-4";
const ok = "border-ink/15 hover:border-ink/30 focus:border-moss focus:ring-lime/40";
const bad = "border-coral bg-coral/5 focus:border-coral focus:ring-coral/20";

export const inputCls = (error?: string) => `${base} ${error ? bad : ok}`;

export function Field({
  label, error, hint, children, id, className = "",
}: { label: string; error?: string; hint?: string; children: ReactNode; id?: string; className?: string }) {
  return (
    <div className={className} data-error={error ? "true" : undefined}>
      {label && <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink/80">{label}</label>}
      {children}
      {error?.trim() ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-coral" role="alert">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-.75 4h1.5v5h-1.5zm0 6.5h1.5V14h-1.5z" /></svg>
          {error}
        </p>
      ) : hint && !error ? (
        <p className="mt-1.5 text-xs text-ink/45">{hint}</p>
      ) : null}
    </div>
  );
}

type TextProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  prefix?: string;
  wrapClass?: string;
};

export function TextField({ label, value, onChange, error, hint, prefix, wrapClass, ...rest }: TextProps) {
  const id = useId();
  return (
    <Field label={label} error={error} hint={hint} id={id} className={wrapClass}>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink/40">{prefix}</span>}
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`${inputCls(error)} ${prefix ? "pl-8" : ""}`}
          {...rest}
        />
      </div>
    </Field>
  );
}

export function SecretField(props: TextProps) {
  const [show, setShow] = useState(false);
  const id = useId();
  const { label, value, onChange, error, hint, wrapClass, ...rest } = props;
  return (
    <Field label={label} error={error} hint={hint} id={id} className={wrapClass}>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`${inputCls(error)} pr-16 tracking-wider`}
          autoComplete="off"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-moss hover:bg-cream"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </Field>
  );
}

export function SelectField<V extends string | number>({
  label, value, onChange, options, error, hint, placeholder = "Select…", wrapClass,
}: {
  label: string; value: V | ""; onChange: (v: V) => void; options: Option<V>[];
  error?: string; hint?: string; placeholder?: string; wrapClass?: string;
}) {
  const id = useId();
  return (
    <Field label={label} error={error} hint={hint} id={id} className={wrapClass}>
      <div className="relative">
        <select
          id={id}
          value={String(value)}
          aria-invalid={!!error}
          onChange={(e) => {
            const o = options.find((o) => String(o.value) === e.target.value);
            if (o) onChange(o.value);
          }}
          className={`${inputCls(error)} appearance-none pr-10 ${value === "" ? "text-ink/40" : ""}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
          ))}
        </select>
        <svg viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-ink/40" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>
      </div>
    </Field>
  );
}

export function ChoiceCards<V extends string | number | boolean>({
  label, value, onChange, options, error, cols = 2,
}: {
  label: string; value: V | null | ""; onChange: (v: V) => void;
  options: { value: V; label: string; hint?: string }[]; error?: string; cols?: 2 | 3 | 4 | 5;
}) {
  const grid = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5" }[cols];
  return (
    <Field label={label} error={error}>
      <div role="radiogroup" aria-label={label} className={`grid grid-cols-2 gap-2.5 ${grid}`}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`relative rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                active
                  ? "border-ink bg-ink text-white shadow-lg shadow-ink/20"
                  : error
                    ? "border-coral/60 bg-white hover:border-ink/40"
                    : "border-ink/15 bg-white hover:border-ink/40"
              }`}
            >
              <span className="font-medium">{o.label}</span>
              {o.hint && <span className={`mt-0.5 block text-xs ${active ? "text-white/60" : "text-ink/45"}`}>{o.hint}</span>}
              {active && (
                <span className="absolute top-2.5 right-2.5 grid h-4 w-4 place-items-center rounded-full bg-lime text-ink">
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 10l3 3 7-7" /></svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

export function CheckRow({
  checked, onChange, error, children, required,
}: { checked: boolean; onChange: (v: boolean) => void; error?: string; children: ReactNode; required?: boolean }) {
  const id = useId();
  return (
    <div data-error={error ? "true" : undefined}>
      <label
        htmlFor={id}
        className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition ${
          checked ? "border-moss bg-lime/15" : error ? "border-coral bg-coral/5" : "border-ink/10 bg-white hover:border-ink/30"
        }`}
      >
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span
          aria-hidden
          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-lime/50 ${
            checked ? "border-ink bg-ink text-lime" : "border-ink/30 bg-white"
          }`}
        >
          {checked && <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 10l3 3 7-7" /></svg>}
        </span>
        <span className="text-sm leading-relaxed text-ink/75">
          {children}
          {required ? <span className="text-coral"> *</span> : <span className="ml-1 text-xs text-ink/40">(optional)</span>}
        </span>
      </label>
      {error && <p className="mt-1.5 ml-1 text-sm text-coral" role="alert">{error}</p>}
    </div>
  );
}

export function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 pt-2">
      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-moss">{title}</h3>
      <span className="h-px flex-1 bg-ink/10" />
      {sub && <span className="text-xs text-ink/40">{sub}</span>}
    </div>
  );
}
