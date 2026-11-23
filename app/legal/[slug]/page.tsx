import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "../../../components/site/Shell";
import { PageHero } from "../../../components/site/PageHero";
import { LEGAL_DOCS, getLegalDoc } from "../../../lib/legal";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = getLegalDoc((await params).slug);
  return doc ? { title: `${doc.title} — Lumen`, description: doc.intro } : {};
}

export default async function LegalPage({ params }: Props) {
  const doc = getLegalDoc((await params).slug);
  if (!doc) notFound();

  return (
    <Shell>
      <PageHero eyebrow={doc.eyebrow} title={doc.title}>
        <p>{doc.intro}</p>
        <p className="mt-4 text-sm text-white/45">Last updated {doc.updated}</p>
      </PageHero>

      <section className="bg-paper py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[260px_1fr] lg:px-8">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">
              On this page
            </p>
            <ol className="mt-4 space-y-1 border-l border-ink/10">
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-ink/60 transition hover:border-moss hover:text-ink"
                  >
                    <span className="mr-2 text-ink/30 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.h}
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-10 rounded-2xl bg-cream p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">
                Other policies
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {LEGAL_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/legal/${d.slug}`}
                      className="text-ink/70 hover:text-ink hover:underline"
                    >
                      {d.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <article className="max-w-3xl">
            {doc.sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-28 border-b border-ink/10 py-10 first:pt-0 last:border-0"
              >
                <h2 className="flex items-baseline gap-4 font-display text-3xl font-medium tracking-tight">
                  <span className="text-lg text-ink/25 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.h}
                </h2>
                {s.p.map((p) => (
                  <p
                    key={p}
                    className="mt-4 text-[17px] leading-relaxed text-ink/70"
                  >
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-5 space-y-3">
                    {s.list.map((li) => (
                      <li
                        key={li}
                        className="flex gap-3 text-[17px] leading-relaxed text-ink/70"
                      >
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            {/* <p className="mt-10 rounded-2xl border border-dashed border-ink/20 p-5 text-sm text-ink/50">
              Demo template. Have qualified legal counsel review this policy before using it with real customers.
            </p> */}
          </article>
        </div>
      </section>
    </Shell>
  );
}
