import { useState, useEffect } from "react";
import { Home, FolderOpen, Images, Phone, MessageSquare, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CONTACT } from "@/data/site";
import { motion, AnimatePresence } from "motion/react";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/services", label: "Services", icon: FolderOpen },
  { href: "/portfolio", label: "Portfolio", icon: Images },
];

export function MobileNav() {
  const [showOptions, setShowOptions] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPhone((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <AnimatePresence>
        {showOptions && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setShowOptions(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 rounded-2xl bg-card border border-border p-3 shadow-xl w-[200px]"
            >
              <a
                href={`tel:${CONTACT.phoneMain}`}
                className="flex items-center gap-3 rounded-xl bg-background px-5 py-3 border border-border hover:border-primary transition-colors"
                onClick={() => setShowOptions(false)}
              >
                <Phone className="size-5 text-primary" />
                <span className="text-sm font-medium">Call Us</span>
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=Hello%20Prime%20Modulars%2C%20I'd%20like%20to%20enquire%20about%20your%20services.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl bg-background px-5 py-3 border border-border hover:border-[#25D366] transition-colors"
                onClick={() => setShowOptions(false)}
              >
                <MessageSquare className="size-5 text-[#25D366]" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Blur backdrop */}
      <div className="relative z-50 border-t border-border bg-[var(--background)] backdrop-blur-2xl">
        <div className="mx-auto grid max-w-sm grid-cols-5 items-center px-2 py-2 pb-safe">
          {ITEMS.slice(0, 2).map((it) => (
            <NavItem key={it.href} {...it} />
          ))}

          {/* Centre action */}
          <button
            onClick={() => setShowOptions(!showOptions)}
            aria-label="Contact Options"
            className="mx-auto -mt-5 flex size-13 items-center justify-center rounded-full shadow-[0_8px_32px_var(--primary)] relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.80 0.05 82), oklch(0.68 0.09 80) 60%, oklch(0.52 0.08 78))",
            }}
          >
            <AnimatePresence mode="wait">
              {showPhone ? (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Phone className="size-5 text-foreground" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <MessageSquare className="size-5 text-foreground" strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {ITEMS.slice(2).map((it) => (
            <NavItem key={it.href} {...it} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Home }) {
  return (
    <Link
      to={href}
      className="flex flex-col items-center gap-1 py-2 text-muted-foreground transition-colors duration-200 hover:text-primary"
    >
      <Icon className="size-5" strokeWidth={1.5} />
      <span className="text-[0.55rem] font-semibold uppercase tracking-widest text-center">
        {label}
      </span>
    </Link>
  );
}
