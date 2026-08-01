import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { checkAuth, adminLogin } from "@/lib/server/auth";
import { TOKEN_KEY } from "@/lib/constants";
import { Loader2, Lock } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminServices } from "@/components/admin/AdminServices";
import { AdminGallery } from "@/components/admin/AdminGallery";
import { z } from "zod";

const searchSchema = z.object({
  view: z.enum(["dashboard", "services", "gallery"]).optional().default("dashboard"),
});

export const Route = createFileRoute("/modular/admin")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  validateSearch: searchSchema,
  component: AdminPage,
});

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await adminLogin({ data: { email, password } });

    if (result.success && result.token) {
      localStorage.setItem(TOKEN_KEY, result.token);
      router({ to: "/modular/admin", search: { view: "dashboard" } });
      window.location.reload();
    } else {
      setError(result.error ?? "Login failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-[var(--gold-soft)]/30">
              <Lock className="size-5 text-[var(--gold-muted)]" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-[var(--espresso-deep)]">
              Admin Login
            </h1>
            <p className="mt-1 text-sm text-gray-500">Prime Modulars Administration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                placeholder="admin@primemodulars.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-all focus:border-[var(--gold-muted)] focus:ring-1 focus:ring-[var(--gold-muted)]"
                placeholder="Enter your password"
              />
            </div>

            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full justify-center text-xs"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function AdminPage() {
  const [authState, setAuthState] = useState<{
    loading: boolean;
    authenticated: boolean;
  }>({ loading: true, authenticated: false });
  const search = useSearch({ from: Route.id });
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAuthState({ loading: false, authenticated: false });
      return;
    }
    checkAuth({ data: { token } }).then((result) => {
      setAuthState({
        loading: false,
        authenticated: result.authenticated,
      });
      if (!result.authenticated) {
        localStorage.removeItem(TOKEN_KEY);
      }
    });
  }, []);

  const setView = useCallback(
    (view: "dashboard" | "services" | "gallery") => {
      nav({ to: "/modular/admin", search: { view } });
    },
    [nav],
  );

  if (authState.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="size-8 animate-spin text-[var(--gold-muted)]" />
      </div>
    );
  }

  if (!authState.authenticated) {
    return <AdminLoginForm />;
  }

  return (
    <AdminLayout>
      {search.view === "dashboard" && <AdminDashboard />}
      {search.view === "services" && <AdminServices />}
      {search.view === "gallery" && <AdminGallery />}
    </AdminLayout>
  );
}
