import type { Metadata } from "next";
import { ApplyWizard } from "@/lumen-frontend/components/apply/ApplyWizard";
import { LOAN_TERMS } from "@/lumen-frontend/components/apply/options";
import {
  AMOUNT_STEP,
  MAX_AMOUNT,
  MIN_AMOUNT,
} from "@/lumen-frontend/components/apply/types";

export const metadata: Metadata = { title: "Apply — Lumen" };

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const a = Number(sp.amount);
  const t = Number(sp.term);
  const amount =
    Number.isFinite(a) && a > 0
      ? Math.min(
          MAX_AMOUNT,
          Math.max(MIN_AMOUNT, Math.round(a / AMOUNT_STEP) * AMOUNT_STEP),
        )
      : undefined;
  const term = LOAN_TERMS.some((o) => o.value === t) ? t : undefined;
  return <ApplyWizard initialAmount={amount} initialTerm={term} />;
}
