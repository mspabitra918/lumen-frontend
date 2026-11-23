import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-white/60">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Straightforward personal loans with fixed payments, real humans, and no surprises.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="hover:text-lime" href="/how-it-works">How it works</Link></li>
              <li><Link className="hover:text-lime" href="/rates">Rates &amp; fees</Link></li>
              <li><Link className="hover:text-lime" href="/why-lumen">Why Lumen</Link></li>
              <li><Link className="hover:text-lime" href="/faq">FAQ</Link></li>
              <li><Link className="hover:text-lime" href="/apply">Apply</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Legal</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="hover:text-lime" href="/legal/privacy-policy">Privacy policy</Link></li>
              <li><Link className="hover:text-lime" href="/legal/terms-of-use">Terms of use</Link></li>
              <li><Link className="hover:text-lime" href="/legal/e-sign-consent">E-sign consent</Link></li>
              <li><Link className="hover:text-lime" href="/legal/responsible-lending">Responsible lending</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">Talk to us</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a className="hover:text-lime" href="tel:18005550199">1-800-555-0199</a></li>
              <li><a className="hover:text-lime" href="mailto:hello@lumen.example">hello@lumen.example</a></li>
              <li>Mon–Fri 8a–8p ET</li>
              <li>Sat 9a–5p ET</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 space-y-3 border-t border-white/10 pt-8 text-xs leading-relaxed text-white/40">
          <p>
            Installment loans are an expensive form of credit meant for short-term financial needs, not a long-term solution.
            Loan approval, amount, APR and terms depend on credit qualification, state of residence and verification. Not all
            applicants will qualify. Example rates shown on this site are illustrative only.
          </p>
          <p>© {new Date().getFullYear()} Lumen. Demo project — not a real lender.</p>
        </div>
      </div>
    </footer>
  );
}
