import { useEffect, useState } from "react";
import { getServices, type Service } from "@/lib/server/services";
import { getGalleryImages } from "@/lib/server/gallery";
import { getTestimonials, type Testimonial } from "@/lib/server/testimonials";
import { Grid3X3, Image, BarChart3, TrendingUp, MessageSquare, type LucideIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className="grid size-11 shrink-0 place-items-center rounded-lg"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--espresso-deep)]">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [images, setImages] = useState<unknown[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getServices(), getGalleryImages({}), getTestimonials()]).then(
      ([svcs, imgs, tests]) => {
        setServices(svcs);
        setImages(imgs);
        setTestimonials(tests);
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-[var(--gold-muted)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-[var(--espresso-deep)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your Prime Modulars admin panel</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Grid3X3}
          label="Services"
          value={services.length}
          color="var(--gold-muted)"
        />
        <StatCard icon={Image} label="Gallery Images" value={images.length} color="#25D366" />
        <StatCard
          icon={BarChart3}
          label="Categories"
          value={new Set(images.map((img: any) => img.category)).size + services.length}
          color="#6366F1"
        />
        <StatCard
          icon={MessageSquare}
          label="Testimonials"
          value={testimonials.length}
          color="#F59E0B"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate({ to: "/modular/admin", search: { view: "services" } })}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-100 p-3 text-left text-sm text-gray-600 transition-all hover:border-[var(--gold-soft)] hover:bg-[var(--gold-soft)]/10 hover:text-[var(--gold-muted)]"
            >
              <Grid3X3 className="size-4 shrink-0" />
              <span>Manage Services</span>
            </button>
            <button
              onClick={() => navigate({ to: "/modular/admin", search: { view: "gallery" } })}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-100 p-3 text-left text-sm text-gray-600 transition-all hover:border-[var(--gold-soft)] hover:bg-[var(--gold-soft)]/10 hover:text-[var(--gold-muted)]"
            >
              <Image className="size-4 shrink-0" />
              <span>Upload Gallery Images</span>
            </button>
            <button
              onClick={() => navigate({ to: "/modular/admin", search: { view: "testimonials" } })}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-100 p-3 text-left text-sm text-gray-600 transition-all hover:border-[var(--gold-soft)] hover:bg-[var(--gold-soft)]/10 hover:text-[var(--gold-muted)]"
            >
              <MessageSquare className="size-4 shrink-0" />
              <span>Manage Testimonials</span>
            </button>
          </div>
        </div>

        {/* Recent Services */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Recent Services
          </h2>
          {services.length === 0 ? (
            <p className="text-sm text-gray-400">No services yet. Add your first service.</p>
          ) : (
            <ul className="space-y-3">
              {services.slice(0, 5).map((s) => (
                <li key={s._id} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="size-2 rounded-full bg-[var(--gold-muted)]" />
                  <span className="flex-1">{s.title}</span>
                  <span className="text-xs text-gray-400">{s.portfolioCategory}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
