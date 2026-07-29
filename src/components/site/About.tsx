import { Reveal, SectionLabel } from "./Reveal";
import { CheckCircle } from "lucide-react";

const HIGHLIGHTS = [
  "20+ years of delivering premium interiors",
  "Full 3D visualization before execution",
  "100% customized to your lifestyle",
  "End-to-end project management",
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-background pt-12 pb-28 sm:pt-16 sm:pb-36">
      {/* Background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-12">
        {/* Image column */}
        <Reveal from="left" className="order-2 lg:order-1">
          <div className="relative">
            {/* Gold border frame */}
            <div
              aria-hidden
              className="absolute -inset-3 border border-primary/30 rounded-sm pointer-events-none"
            />
            {/* Second offset border */}
            <div
              aria-hidden
              className="absolute -inset-6 border border-[var(--primary)] rounded-sm pointer-events-none"
            />
            <img
              src="/assets/gallery/living-10.jpg"
              alt="Luxury living room designed by Prime Modulars"
              width={1200}
              height={1400}
              loading="lazy"
              className="relative w-full rounded-sm object-cover shadow-[var(--shadow-luxe)]"
              style={{ maxHeight: "38rem", objectPosition: "center" }}
            />
            {/* Gold badge */}
            <div className="absolute -bottom-6 -right-6 flex flex-col items-center justify-center size-28 rounded-full bg-gradient-to-br from-[oklch(0.82_0.05_82)] to-[oklch(0.52_0.08_78)] shadow-[0_8px_40px_var(--gold)]">
              <span className="font-display text-3xl font-light text-foreground">20</span>
              <span className="label-caps text-[0.5rem] text-[var(--background)/0.8]">Years of</span>
              <span className="label-caps text-[0.5rem] text-[var(--background)/0.8]">Excellence</span>
            </div>
          </div>
        </Reveal>

        {/* Text column */}
        <Reveal delay={0.15} className="order-1 lg:order-2">
          <SectionLabel>Our Story</SectionLabel>

          <h2 className="mt-6 text-4xl font-light leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            Two decades of quiet,{" "}
            <span className="italic text-primary">precise</span>
            <br />
            craftsmanship.
          </h2>

          <div className="rule-gold my-8 max-w-36" />

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Prime Modulars Company has been transforming homes and commercial spaces since 2004,
            blending 3D design precision with premium craftsmanship. Based in Tadepalli, Guntur, the
            studio specialises in fully customised modular interiors.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Every project is designed digitally in 3D before execution   so you walk through your
            space, adjust every finish and detail, and see exactly how it will feel long before the
            first panel is cut.
          </p>

          {/* Highlights */}
          <ul className="mt-10 space-y-3">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-3">
                <CheckCircle
                  className="size-4 shrink-0 text-primary"
                  strokeWidth={1.5}
                />
                <span className="text-sm text-foreground/90">{h}</span>
              </li>
            ))}
          </ul>

          {/* Brand stamp */}
          <div className="mt-12 flex items-center gap-4 border-t border-border pt-8">
            <img
              src="/logo.png"
              alt="Prime Modulars emblem"
              width={96}
              height={96}
              loading="lazy"
              className="size-24 object-contain opacity-90"
            />
            <div>
              <p className="font-display text-lg text-foreground">Prime Modulars Company</p>
              <p className="label-caps mt-1 text-primary">Est. 2004 · Tadepalli, Guntur</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
