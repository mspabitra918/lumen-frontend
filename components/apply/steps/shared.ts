import type { Errors } from "../validation";
import type { ApplicationFormData, FieldOf, Section } from "../types";

export type StepProps<S extends Section> = {
  value: ApplicationFormData[S];
  set: <K extends FieldOf<S>>(field: K, v: ApplicationFormData[S][K]) => void;
  errors: Errors;
};

/** Text value for a numeric field stored as NaN-when-empty. */
export const numText = (n: number) => (Number.isFinite(n) ? String(n) : "");
export const toNum = (s: string) => (s.trim() === "" ? NaN : Number(s));
