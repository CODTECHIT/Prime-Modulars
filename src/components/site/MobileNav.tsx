import { Home, FolderOpen, Images, Phone, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CONTACT } from "@/data/site";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/expertise", label: "Services", icon: FolderOpen },
  { href: "/portfolio", label: "Portfolio", icon: Images },
  { href: "/clients", label: "Clients", icon: Phone },
];

export function MobileNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
    >
      {/* Blur backdrop */}
      <div className="border-t border-border bg-[var(--background)] backdrop-blur-2xl">
        <div className="mx-auto grid max-w-sm grid-cols-5 items-center px-2 py-2 pb-safe">
          {ITEMS.slice(0, 2).map((it) => (
            <NavItem key={it.href} {...it} />
          ))}

          {/* Centre action   WhatsApp */}
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=Hello%20Prime%20Modulars%2C%20I'd%20like%20to%20enquire%20about%20your%20services.`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp Prime Modulars"
            className="mx-auto -mt-5 flex size-13 items-center justify-center rounded-full shadow-[0_8px_32px_var(--primary)]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.80 0.05 82), oklch(0.68 0.09 80) 60%, oklch(0.52 0.08 78))",
            }}
          >
            <MessageSquare className="size-5 text-foreground" strokeWidth={2.5} />
          </a>

          {ITEMS.slice(2).map((it) => (
            <NavItem key={it.href} {...it} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof Home;
}) {
  return (
    <Link
      to={href}
      className="flex flex-col items-center gap-1 py-2 text-muted-foreground transition-colors duration-200 hover:text-primary"
    >
      <Icon className="size-5" strokeWidth={1.5} />
      <span className="text-[0.55rem] font-semibold uppercase tracking-widest">{label}</span>
    </Link>
  );
}
