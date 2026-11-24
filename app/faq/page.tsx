import type { Metadata } from "next";
import { Shell } from "@/lumen-frontend/components/site/Shell";
import { PageHero } from "@/lumen-frontend/components/site/PageHero";
import { CtaBand } from "@/lumen-frontend/components/site/CtaBand";
import { FaqExplorer } from "@/lumen-frontend/components/site/FaqExplorer";
import { FAQ_GROUPS } from "@/lumen-frontend/lib/content";

export const metadata: Metadata = {
  title: "FAQ — Lumen",
  description:
    "Answers about applying, rates, funding and repaying a Lumen loan.",
};

export default function FaqPage() {
  return (
    <Shell>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Good questions, <em className="text-lime italic">straight</em>{" "}
            answers.
          </>
        }
      >
        Everything about applying, rates, funding and repaying. Can’t find it?
        Call{" "}
        <a
          href="tel:18005550199"
          className="font-semibold text-white underline decoration-lime decoration-2 underline-offset-4"
        >
          1-800-555-0199
        </a>
        .
      </PageHero>
      <section className="bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <FaqExplorer groups={FAQ_GROUPS} />
        </div>
      </section>
      <CtaBand />
    </Shell>
  );
}
