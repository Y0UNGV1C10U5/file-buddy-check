import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-lg uppercase leading-none tracking-tight">
            Unlawfully
          </span>
          <span className="font-display text-lg uppercase leading-none tracking-tight text-signal">
            Detained
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="eyebrow transition-colors hover:text-signal"
              activeProps={{ className: "eyebrow text-signal" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/"
            hash="deadline"
            className="border-2 border-ink bg-signal px-4 py-2 font-display text-sm uppercase text-signal-foreground transition-transform hover:-translate-y-0.5"
          >
            Check my deadline
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t-2 border-ink bg-background md:hidden">
          <nav className="container-page flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="border-b border-border py-4 font-display text-xl uppercase"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              hash="deadline"
              className="my-4 border-2 border-ink bg-signal px-4 py-4 text-center font-display text-xl uppercase text-signal-foreground"
              onClick={() => setOpen(false)}
            >
              Check my deadline
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
