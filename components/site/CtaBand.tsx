import Link from "next/link";

export function CtaBand({ title = "Your rate is five minutes away.", sub = "Checking won’t affect your credit score. No commitment, no fees." }: { title?: string; sub?: string }) {
  return (
    <section className="px-5 py-24 lg:px-8">
      <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-lime px-8 py-16 text-center sm:px-16 lg:py-24">
        <div aria-hidden className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
        <h2 className="relative mx-auto max-w-3xl font-display text-4xl font-medium tracking-tight text-ink sm:text-6xl">{title}</h2>
        <p className="relative mx-auto mt-5 max-w-xl text-lg text-ink/70">{sub}</p>
        <Link href="/apply" className="relative mt-10 inline-flex rounded-full bg-ink px-10 py-4 font-semibold text-lime transition hover:scale-[1.03]">
          Check my rate
        </Link>
      </div>
    </section>
  );
}
