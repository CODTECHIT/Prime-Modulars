import { CONTACT } from "@/data/site";
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

const NAV = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/process", label: "Our Process" },
  { href: "/clients", label: "Client Stories" },
  { href: "/", label: "Home" },
];

const CONTACT_ITEMS = [
  { icon: ShieldCheck, label: `GST Registered: ${CONTACT.gstin}`, href: "#" },
  { icon: Phone, label: CONTACT.phoneMain, href: `tel:${CONTACT.phoneMain}` },
  { icon: Phone, label: CONTACT.phoneAlt, href: `tel:${CONTACT.phoneAlt}` },
  { icon: Mail, label: CONTACT.email, href: `mailto:${CONTACT.email}` },
  {
    icon: MessageSquare,
    label: `WhatsApp +${CONTACT.whatsapp}`,
    href: `https://wa.me/${CONTACT.whatsapp}`,
  },
  { icon: MapPin, label: CONTACT.address, href: "#", multiline: true },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      {/* Top gold rule */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
      />

      {/* Main content */}
      <div className="mx-auto grid max-w-7xl gap-14 px-6 pt-16 pb-10 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Link to="/" className="flex items-center gap-3" aria-label="Prime Modulars home">
            <img
              src="/logo.png"
              alt="Prime Modulars logo"
              width={80}
              height={80}
              className="size-20 object-contain drop-shadow-md"
            />
            <div>
              <p className="font-display text-lg font-light text-foreground">Prime Modulars</p>
              <p className="label-caps text-[0.6rem] text-primary">Company · Est. 2004</p>
            </div>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Premium custom modular interiors crafted in Tadepalli, serving Guntur, Vijayawada,
            Mangalagiri and beyond since 2004.
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-foreground font-medium">
            <ShieldCheck className="size-3.5 text-primary shrink-0" />
            <span>GST Registered: <strong className="font-mono text-primary font-bold">{CONTACT.gstin}</strong></span>
          </div>

          {/* Social / CTA */}
          <div className="mt-6">
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary transition-all hover:bg-[var(--primary)] hover:border-primary"
            >
              <MessageSquare className="size-3.5" />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Nav links */}
        <div className="lg:col-span-3">
          <p className="label-caps mb-5 text-muted-foreground">Navigate</p>
          <ul className="space-y-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  to={n.href}
                  className="text-sm text-foreground/90 transition-colors hover:text-primary"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-5">
          <p className="label-caps mb-5 text-muted-foreground">Contact Information</p>
          <ul className="space-y-4">
            {CONTACT_ITEMS.map((c, i) => (
              <li key={i}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-start gap-3 text-sm text-foreground/90 transition-colors hover:text-primary"
                >
                  <c.icon className="mt-0.5 size-3.5 shrink-0 text-primary" strokeWidth={1.5} />
                  <span
                    className={
                      c.multiline
                        ? "leading-snug text-muted-foreground group-hover:text-foreground/90"
                        : ""
                    }
                  >
                    {c.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-muted-foreground sm:flex-row lg:px-12">
          <p>© {new Date().getFullYear()} Prime Modulars Company. All rights reserved. · GSTIN: <span className="font-mono font-medium text-foreground">{CONTACT.gstin}</span></p>
          <p>GST Registered Entity · Tadepalli · Guntur Dist. · Andhra Pradesh, India</p>
        </div>
      </div>
    </footer>
  );
}
