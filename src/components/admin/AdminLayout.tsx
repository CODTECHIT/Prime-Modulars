import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Grid3X3, Image, LogOut, Menu, X, ChevronRight, MessageSquare } from "lucide-react";
import { TOKEN_KEY } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, view: "dashboard" as const },
  { label: "Services", icon: Grid3X3, view: "services" as const },
  { label: "Gallery", icon: Image, view: "gallery" as const },
  { label: "Testimonials", icon: MessageSquare, view: "testimonials" as const },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate({ to: "/modular/admin", search: { view: "dashboard" } });
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <span className="text-lg font-display font-semibold tracking-tight text-[var(--espresso-deep)]">
            Prime Admin
          </span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-6 space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.view}
              to="/modular/admin"
              search={{ view: item.view }}
              onClick={() => setSidebarOpen(false)}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-[var(--gold-soft)]/30 hover:text-[var(--espresso-deep)] [&.active]:bg-[var(--gold-soft)]/40 [&.active]:text-[var(--gold-muted)]"
              activeOptions={{ exact: false }}
            >
              <item.icon className="size-4 shrink-0" />
              <span>{item.label}</span>
              <ChevronRight className="ml-auto size-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/80 backdrop-blur-md px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="size-5" />
          </button>
          <div className="flex-1" />
          <Link
            to="/"
            className="text-xs font-medium text-gray-400 transition-colors hover:text-[var(--gold-muted)]"
          >
            View Site →
          </Link>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
