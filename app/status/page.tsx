import type { Metadata } from "next";
import { Shell } from "@/components/site/Shell";
import { PageHero } from "@/components/site/PageHero";
import LoanStatusLookup from "@/components/status/LoanStatusLookup";

export const metadata: Metadata = {
  title: "Application status — Lumen",
  description: "Check the status of your Lumen loan application.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

// Served at /status and /track-loan (the link in the backend's emails, which
// passes ?applicationId=…&email=…).
export default async function StatusPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const initialId = str(sp.id) || str(sp.applicationId);
  const initialEmail = str(sp.email);

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
        Enter your application ID and email to see exactly where things stand.
      </PageHero>
      <section className="bg-paper py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <LoanStatusLookup initialId={initialId} initialEmail={initialEmail} />
        </div>
      </section>
    </Shell>
  );
}
