import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Phone, X } from "lucide-react";
import { CONTACT } from "@/data/site";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-3"
        >
          {/* Expanded actions */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-end gap-2.5"
              >
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=Hello%20Prime%20Modulars%2C%20I'd%20like%20to%20enquire%20about%20your%20services.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-full border border-primary/40 bg-[var(--card)] px-5 py-3 shadow-[0_8px_32px_oklch(0.04_0.005_60/0.8)] backdrop-blur-xl transition-all hover:border-primary"
                >
                  <span className="text-sm font-medium text-foreground">WhatsApp</span>
                  <MessageSquare className="size-4 text-primary" strokeWidth={1.5} />
                </a>

                {/* Call */}
                <a
                  href={`tel:${CONTACT.phoneMain}`}
                  className="flex items-center gap-3 rounded-full border border-primary/40 bg-[var(--card)] px-5 py-3 shadow-[0_8px_32px_oklch(0.04_0.005_60/0.8)] backdrop-blur-xl transition-all hover:border-primary"
                >
                  <span className="text-sm font-medium text-foreground">
                    Call Now
                  </span>
                  <Phone className="size-4 text-primary" strokeWidth={1.5} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close contact options" : "Open contact options"}
            className="grid size-14 place-items-center rounded-full shadow-[0_8px_40px_var(--primary)] transition-all duration-300 hover:scale-110"
            style={{
              background: "linear-gradient(135deg, oklch(0.80 0.05 82), oklch(0.68 0.09 80) 60%, oklch(0.52 0.08 78))",
            }}
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="grid place-items-center"
            >
              {open ? (
                <X className="size-5 text-foreground" strokeWidth={2.5} />
              ) : (
                <MessageSquare className="size-5 text-foreground" strokeWidth={2.5} />
              )}
            </motion.span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
