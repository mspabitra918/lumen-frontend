import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="grain relative overflow-hidden bg-ink pt-36 pb-20 text-white lg:pt-44 lg:pb-28">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-5%] h-[520px] w-[520px] rounded-full bg-lime/20 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <p className="animate-rise text-sm font-semibold uppercase tracking-[0.2em] text-lime">{eyebrow}</p>
        <h1 className="animate-rise mt-5 max-w-4xl font-display text-5xl leading-[1.04] font-medium tracking-tight [animation-delay:80ms] sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {children && <div className="animate-rise mt-7 max-w-2xl text-lg leading-relaxed text-white/65 [animation-delay:160ms]">{children}</div>}
      </div>
    </section>
  );
}
