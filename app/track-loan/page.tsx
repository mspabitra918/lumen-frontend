import type { Metadata } from "next";
import { Suspense } from "react";
import { Shell } from "@/components/site/Shell";
import { PageHero } from "@/components/site/PageHero";
import TrackingSearch from "@/app/track-loan/TrackingSearch";

export const metadata: Metadata = {
  title: "Application status — Lumen",
  description: "Check the status of your Lumen loan application.",
  alternates: { canonical: "/track-loan" },
};

// Served at /track-loan (also the link in the backend's emails, which passes
// ?applicationId=…&email=…). /status redirects here — see next.config.ts.
export default function TrackLoanPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="Application status"
        title={
          <>
            Where’s my <em className="text-lime italic">loan</em>?
          </>
        }
      >
        Enter your email and application ID to see exactly where things stand.
      </PageHero>
      <section className="bg-paper py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Suspense
            fallback={
              <div
                className="mx-auto min-h-96 max-w-lg rounded-3xl border border-ink/10 bg-white"
                aria-label="Loading application lookup"
              />
            }
          >
            <TrackingSearch />
          </Suspense>
        </div>
      </section>
    </Shell>
  );
}
