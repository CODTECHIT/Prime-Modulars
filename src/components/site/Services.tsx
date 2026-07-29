import { ChefHat, DoorOpen, Tv, Columns3, Flame, Layers, TreePine, ArrowRight } from "lucide-react";
import { Reveal, SectionLabel } from "./Reveal";
import { scrollToId } from "./useSmoothScroll";
import { useState } from "react";

const SERVICES = [
  {
    icon: ChefHat,
    title: "Modular Kitchen",
    text: "Ergonomic, elegant kitchens tailored to how you cook and live   from island layouts to L-shaped galleries.",
    image: "/assets/gallery/kitchen-01.jpg",
    num: "01",
  },
  {
    icon: DoorOpen,
    title: "Wardrobes",
    text: "Space-smart wardrobe solutions with premium laminates, soft-close hardware and walk-in configurations.",
    image: "/assets/gallery/wardrobe-01.jpg",
    num: "02",
  },
  {
    icon: Tv,
    title: "TV Units",
    text: "Statement media walls and floating TV units that anchor your living room with purpose and style.",
    image: "/assets/gallery/tv-unit-01.jpg",
    num: "03",
  },
  {
    icon: Columns3,
    title: "Hall Partitions",
    text: "Stylish dividers   lattice, slat, or glass   that add privacy without closing off light or space.",
    image: "/assets/gallery/entryway-01.jpg",
    num: "04",
  },
  {
    icon: Flame,
    title: "Pooja Units",
    text: "Serene, beautifully detailed prayer spaces crafted in teak, marble, and premium engineered wood.",
    image: "/assets/gallery/pooja-01.jpg",
    num: "05",
  },
  {
    icon: Layers,
    title: "False Ceilings",
    text: "Layered lighting and ceiling design with cove lights, trays, and profiles that transform ambience.",
    image: "/assets/gallery/ceiling-01.jpg",
    num: "06",
  },
  {
    icon: TreePine,
    title: "Wooden Ceilings",
    text: "Warm, textured wooden ceiling treatments   slat, plank or coffered   for a boutique, resort feel.",
    image: "/assets/gallery/ceiling-04.jpg",
    num: "07",
  },
];

export function Services() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="grain relative overflow-hidden bg-card py-24 sm:py-36"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />


      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section header */}
        <Reveal>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>Our Services</SectionLabel>
              <h2 className="mt-5 max-w-2xl text-4xl font-light leading-tight text-foreground sm:text-6xl">
                Seven disciplines,{" "}
                <span className="italic text-primary">one standard</span>.
              </h2>
            </div>
            <button
              onClick={() => scrollToId("portfolio")}
              className="label-caps flex shrink-0 items-center gap-2 text-primary transition-all hover:gap-4"
            >
              View Portfolio <ArrowRight className="size-4" />
            </button>
          </div>
        </Reveal>

        {/* Services grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:mt-16 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <article
                className="group relative h-full overflow-hidden rounded-2xl border border-border bg-background transition-all duration-500 hover:border-[var(--primary)] hover:shadow-[var(--shadow-gold)]"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.04_0.005_60/0.65)] to-transparent" />
                  {/* Number badge */}
                  <span className="absolute top-3 right-3 font-display text-4xl leading-none text-[var(--gold)]/40 group-hover:text-[var(--gold)] transition-colors duration-500">
                    {s.num}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2.5">
                    <s.icon
                      className="size-4 shrink-0 text-primary"
                      strokeWidth={1.3}
                    />
                    <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-foreground">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-primary opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="label-caps text-[0.6rem]">Learn More</span>
                    <ArrowRight className="size-3" />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          {/* CTA card */}
          <Reveal delay={SERVICES.length * 0.06}>
            <div
              className="relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl p-6 cursor-pointer"
              style={{
                  background:
                    "linear-gradient(145deg, var(--gold-muted), oklch(0.55_0.08_78/0.06))",
                border: "1px solid var(--primary)",
              }}
              onClick={() => scrollToId("contact")}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full border border-[var(--primary)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full border border-border"
              />
              <h3 className="font-display text-3xl font-light text-foreground">
                Bring Your
                <br />
                <span className="italic text-primary">Dream Space</span>
                <br />
                to Life
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Get a personalized 3D design and expert guidance from our studio.
              </p>
              <button
                className="btn-gold mt-6 self-start"
                onClick={() => scrollToId("contact")}
              >
                Book Consultation <ArrowRight className="size-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
