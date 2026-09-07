import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-4 border-ink bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl uppercase leading-none">
            Unlawfully <span className="text-signal">Detained</span>
          </p>
          <p className="mt-3 max-w-xs text-sm opacity-80">
            Answer your eviction papers on time, in your own words, on paper the court
            accepts.
          </p>
        </div>

        <div>
          <p className="eyebrow opacity-70">Pages</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-signal">
                Home
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-signal">
                How it works
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-signal">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-signal">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow opacity-70">Free help</p>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li>LA County Self-Help Centers at your courthouse</li>
            <li>Stay Housed LA — free tenant legal help</li>
            <li>LawHelpCA.org — legal aid directory</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-foreground/20">
        <div className="container-page py-6">
          <p className="text-xs leading-relaxed opacity-70">
            Not a law firm, not an attorney. Legal document assistant, registered LA
            County, $25k bond. Legal information and document preparation only, not legal
            advice.
          </p>
          <p className="mt-3 text-xs opacity-50">
            © {new Date().getFullYear()} Unlawfully Detained. Deadline dates are estimates
            based on CCP § 1167 and the California court holiday calendar — always confirm
            with the court or a legal aid provider.
          </p>
        </div>
      </div>
    </footer>
  );
}
