import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal, SectionLabel } from "./Reveal";

const TESTIMONIALS = [
  {
    name: "Ramesh Kumar",
    location: "Tadepalli",
    project: "Modular Kitchen",
    quote:
      "Seeing our kitchen in 3D before a single cabinet was installed was remarkable. Everything came out exactly as designed   the finish quality is exceptional.",
  },
  {
    name: "Priya Venkateshwarlu",
    location: "Guntur",
    project: "Living Room & Partition",
    quote:
      "Prime Modulars transformed our entire living space with a stunning wood partition and TV unit. The attention to detail is unmatched in the city.",
  },
  {
    name: "Suresh Babu",
    location: "Mangalagiri",
    project: "Full Home Interiors",
    quote:
      "From the wardrobe to the false ceiling, every element is flawless. They delivered on time and the 3D preview made decision-making so much easier.",
  },
  {
    name: "Anitha Reddy",
    location: "Vijayawada",
    project: "Pooja Unit & Bedroom",
    quote:
      "The pooja unit they crafted is a work of art. My entire family was in awe. The team's patience during the design phase was truly commendable.",
  },
  {
    name: "Narasimha Rao",
    location: "Tadepalli",
    project: "Luxury Kitchen & Wardrobes",
    quote:
      "The best interior decision we ever made. The 3D design sessions with their team felt like working with architects, not furniture makers.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const t = TESTIMONIALS[index];
  const prev = () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-background py-24 sm:py-36"
    >
      {/* Divider */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
      />


      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-12">
        <Reveal className="text-center">
          <SectionLabel>Client Stories</SectionLabel>
          <h2 className="mt-5 text-4xl font-light leading-tight text-foreground sm:text-5xl lg:text-6xl">
            What our clients{" "}
            <span className="italic text-primary">say.</span>
          </h2>
        </Reveal>

        {/* Testimonial card */}
        <div className="relative mt-16">
          {/* Outer decorative ring */}
          <div
            aria-hidden
            className="absolute -inset-4 border border-border/50 rounded-3xl pointer-events-none"
          />

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-0 md:grid-cols-5"
              >
                {/* Project image */}
                <div className="relative md:col-span-2 min-h-[16rem] overflow-hidden">
                  <img
                    src="/assets/gallery/living-02.jpg"
                    alt="Client project showcase"
                    className="absolute inset-0 size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-5 left-5 z-10">
                    <p className="label-caps font-bold text-primary drop-shadow-md">{t.project}</p>
                    <p className="mt-1 font-display font-bold text-2xl text-white drop-shadow-md">{t.name}</p>
                    <p className="label-caps text-[0.6rem] font-bold text-white/80 drop-shadow-md mt-1">{t.location}</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="flex flex-col justify-center p-8 md:col-span-3 lg:p-12">
                  <Quote
                    className="size-8 text-primary/50"
                    strokeWidth={1}
                  />
                  <p className="mt-6 font-display text-xl font-light leading-relaxed text-foreground/90 sm:text-2xl">
                    "{t.quote}"
                  </p>
                  {/* Stars */}
                  <div className="mt-8 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 12 12"
                        className="size-3.5 fill-primary"
                      >
                        <path d="M6 0l1.5 4.5H12L8.25 7.5 9.75 12 6 9l-3.75 3 1.5-4.5L0 4.5h4.5z" />
                      </svg>
                    ))}
                    <span className="ml-2 label-caps text-muted-foreground">Verified Client</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-[3px] rounded-full transition-all duration-500 ${i === index
                      ? "w-8 bg-primary"
                      : "w-3 bg-[var(--primary)]"
                    }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="grid size-11 place-items-center rounded-full border border-primary/30 text-foreground/90 transition-all hover:border-primary hover:text-primary"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="grid size-11 place-items-center rounded-full border border-primary/30 text-foreground/90 transition-all hover:border-primary hover:text-primary"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
