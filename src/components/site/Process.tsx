import { Reveal, SectionLabel } from "./Reveal";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Monitor, PenTool, Hammer, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Monitor,
    num: "01",
    title: "Discovery",
    subtitle: "Understanding your vision",
    text: "We begin with a detailed consultation   listening to your lifestyle, preferences, and budget to map every corner of your future interior.",
    color: "from-[oklch(0.55_0.08_78/0.12)] to-[oklch(0.55_0.08_78/0.02)]",
  },
  {
    icon: PenTool,
    num: "02",
    title: "3D Design",
    subtitle: "Walk through it before it's built",
    text: "Every project is rendered in photo-realistic 3D. You explore your space, pick finishes, and approve every last detail   before production begins.",
    color: "from-[oklch(0.55_0.08_78/0.12)] to-[oklch(0.55_0.08_78/0.02)]",
  },
  {
    icon: Hammer,
    num: "03",
    title: "Precision Craft",
    subtitle: "Manufactured to tolerance",
    text: "Panels are cut and assembled in our controlled workshop with premium laminates and soft-close hardware   then installed by our trained in-house team.",
    color: "from-[oklch(0.55_0.08_78/0.12)] to-[oklch(0.55_0.08_78/0.02)]",
  },
  {
    icon: Sparkles,
    num: "04",
    title: "Handover",
    subtitle: "Your space, perfected",
    text: "We conduct a thorough quality walk-through with you. Every hinge, every drawer, every finish is inspected together before we call it done.",
    color: "from-[oklch(0.55_0.08_78/0.12)] to-[oklch(0.55_0.08_78/0.02)]",
  },
];

function StepCard({ step, i }: { step: (typeof STEPS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:border-primary/50 hover:shadow-[var(--shadow-gold)]"
    >
      {/* Gradient fill */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-100 transition-opacity duration-500 group-hover:opacity-100`}
      />

      {/* Step number (large, faded) */}
      <span
        aria-hidden
        className="absolute top-4 right-5 font-display text-6xl font-light leading-none text-[var(--primary)] transition-all duration-500 group-hover:text-[var(--primary)]"
      >
        {step.num}
      </span>

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-6 grid size-12 place-items-center rounded-xl border border-primary/40 bg-background">
          <step.icon className="size-5 text-primary" strokeWidth={1.4} />
        </div>

        <p className="label-caps mb-2 text-primary">{step.subtitle}</p>
        <h3 className="font-display text-2xl font-light text-foreground sm:text-3xl">
          {step.title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
      </div>
    </motion.div>
  );
}

export function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-card py-24 sm:py-36">
      {/* Divider */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Our Process</SectionLabel>
            <h2 className="mt-5 text-4xl font-light leading-tight text-foreground sm:text-5xl lg:text-6xl">
              From first conversation
              <br />
              to <span className="italic text-primary">final reveal.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              A transparent, four-step journey with full 3D visualization so there are no surprises
              only delight.
            </p>
          </div>
        </Reveal>

        {/* Feature image */}
        <Reveal delay={0.1} className="my-14">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[var(--primary)]">
            <img
              src="/assets/gallery/bedroom-02.jpg"
              alt="Premium bedroom interior designed by Prime Modulars"
              loading="lazy"
              className="w-full object-cover"
              style={{ maxHeight: "22rem", objectPosition: "center 30%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
            <div className="absolute bottom-6 left-8">
              <p className="font-display text-3xl font-bold text-white drop-shadow-md">
                See it before
                <br />
                <span className="italic text-primary drop-shadow-md">you build it.</span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <StepCard key={step.title} step={step} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
