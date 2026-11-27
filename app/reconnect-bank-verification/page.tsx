import type { Metadata } from "next";
import { Suspense } from "react";
import BankVerificationForm from "@/components/bank-verification/BankVerificationForm";

export const metadata: Metadata = {
  title: "Reconnect Your Bank",
  description:
    "Reconnect your online banking to complete verification for your Lumen Loans application.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/reconnect-bank-verification" },
};

// Header and Footer come from the root layout.
export default function ReconnectBankPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <BankVerificationForm mode="reconnect" />
    </Suspense>
  );
}
