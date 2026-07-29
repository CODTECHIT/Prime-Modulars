import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { CONTACT } from "@/data/site";
import { Link } from "@tanstack/react-router";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/expertise", label: "Expertise" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/process", label: "Process" },
  { href: "/clients", label: "Clients" },
  { href: "/", label: "Home" },
];

const LEFT = LINKS.slice(0, 3);
const RIGHT = LINKS.slice(3);

export function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMobileNav = () => {
    setOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-border/50 bg-background/95 py-2 shadow-sm backdrop-blur-xl"
          : "bg-transparent py-4"
      }`}
    >
      {/* Desktop */}
      <nav className="mx-auto hidden max-w-7xl grid-cols-3 items-center gap-6 px-8 lg:grid">
        {/* Left links */}
        <div className="flex items-center gap-8">
          {LEFT.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`label-caps link-gold transition-colors duration-300 hover:text-primary ${solid ? 'text-foreground/80' : 'text-ivory/90'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Center logo */}
        <div className="flex justify-center">
          <Link
            to="/"
            aria-label="Prime Modulars home"
            className="mx-auto flex items-center gap-3 group absolute left-1/2 top-2 -translate-x-1/2"
          >
            <span
              className={`relative grid place-items-center transition-all duration-500 group-hover:scale-105 ${
                solid ? "size-[5rem]" : "size-[9.5rem]"
              }`}
            >
              <img src="/logo.png" alt="Prime Modulars logo" className="size-full object-contain drop-shadow-xl" />
            </span>
          </Link>
        </div>

        {/* Right links */}
        <div className="flex items-center justify-end gap-8">
          {RIGHT.map((l, i) =>
            i === RIGHT.length - 1 ? (
              <Link
                key={l.href}
                to={l.href}
                className={`label-caps inline-flex items-center gap-2 rounded-full border px-5 py-2 transition-all duration-300 ${solid ? 'border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground' : 'border-ivory/40 text-ivory hover:bg-ivory hover:text-primary'}`}
              >
                {l.label} <ChevronRight className="size-3" />
              </Link>
            ) : (
              <Link
                key={l.href}
                to={l.href}
                className={`label-caps link-gold transition-colors duration-300 hover:text-primary ${solid ? 'text-foreground/80' : 'text-ivory/90'}`}
              >
                {l.label}
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Mobile */}
      <nav className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid size-10 place-items-center rounded-full border border-primary/30 text-foreground/80 transition-colors hover:border-primary hover:text-primary"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>

        <Link
          to="/"
          aria-label="Prime Modulars home"
          className="mx-auto grid place-items-center"
        >
          <span
            className={`grid place-items-center transition-all duration-500 ${
              solid ? "size-12" : "size-16"
            }`}
          >
            <img src="/logo.png" alt="Prime Modulars logo" className="size-full object-contain drop-shadow-lg" />
          </span>
        </Link>

        <a
          href={`tel:${CONTACT.phoneMain}`}
          aria-label="Call Prime Modulars"
          className="grid size-10 place-items-center rounded-full border border-primary/40 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          <Phone className="size-4" />
        </a>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-0 px-6 py-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={l.href}
                    onClick={handleMobileNav}
                    className="flex items-center justify-between border-b border-border py-4 text-left"
                  >
                    <span className="label-caps text-foreground/90">{l.label}</span>
                    <ChevronRight className="size-3.5 text-primary" />
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 flex gap-3">
                <a
                  href={`tel:${CONTACT.phoneMain}`}
                  className="btn-gold flex-1 justify-center py-3 text-center"
                >
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex-1 justify-center py-3 text-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
