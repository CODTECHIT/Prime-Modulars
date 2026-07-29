import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";

// Hero uses real project images from gallery
const SLIDES = [
  { src: "/assets/gallery/living-01.jpg", alt: "Luxury living room with geometric wood partition   Guntur residence" },
  { src: "/assets/gallery/living-07.jpg", alt: "Grand living area with beautiful wood ceiling" },
  { src: "/assets/gallery/kitchen-04.jpg", alt: "Luxury modular kitchen with brass lighting" },
  { src: "/assets/gallery/bedroom-06.jpg", alt: "Premium master bedroom with teak headboard" },
];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 2000, 1);
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref} className="font-display text-4xl text-primary sm:text-5xl">
      {value}
      {suffix}
    </span>
  );
}

const STATS = [
  { to: 20, suffix: "+", label: "Years Experience" },
  { to: 500, suffix: "+", label: "Projects Delivered" },
  { to: 100, suffix: "%", label: "Custom Design" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-svh overflow-hidden bg-background"
    >
      {/* Full-bleed background slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={index}
            src={SLIDES[index].src}
            alt={SLIDES[index].alt}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 size-full object-cover"
          />
        </AnimatePresence>
        {/* Multi-layer gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#15110E]/70 via-[#15110E]/10 to-[#15110E]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15110E]/80 via-[#15110E]/10 to-[#15110E]/40" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex min-h-svh flex-col justify-center px-6 pt-28 pb-16 lg:px-16 xl:px-24"
      >
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="label-caps mb-4 flex items-center gap-4 text-ivory/90 sm:mb-8"
          >
            <div className="h-px w-8 bg-ivory/60 sm:w-12" />
            <span className="label-caps font-bold text-white group-hover:text-gold transition-colors">
              Tadepalli · Guntur · Est. 2004
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl text-5xl font-light leading-[1.04] text-ivory sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem]"
          >
            Spaces Crafted
            <br />
            <span className="block font-medium italic text-gold">With Precision</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="mt-7 max-w-lg text-base font-medium leading-relaxed text-white lg:text-lg drop-shadow-xl"
          >
            Premium modular interiors with full 3D visualization   designed and crafted
            to perfection before a single panel is cut.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/portfolio"
              className="btn-gold"
            >
              Explore Portfolio <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-ivory/30 px-8 py-3.5 text-[0.6875rem] font-semibold tracking-[0.3em] uppercase text-ivory transition-all hover:bg-ivory hover:text-primary"
            >
              <Play className="size-3.5 fill-current" /> Free Consultation
            </Link>
          </motion.div>

          {/* Slide indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-14 flex items-center gap-2"
          >
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-10 bg-primary"
                    : "w-4 bg-[oklch(0.71_0.06_82)/0.25]"
                }`}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="relative z-10 border-t border-border/50 bg-background"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-border/50 px-6 lg:px-16">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-8 gap-2">
              <Counter to={s.to} suffix={s.suffix} />
              <p className="label-caps text-[0.55rem] font-bold tracking-widest text-foreground sm:text-[0.6875rem]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Logo emblem floating badge (desktop) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="pointer-events-none absolute bottom-28 right-8 z-20 hidden size-28 place-items-center rounded-full border border-primary/60 bg-[var(--card)] shadow-[0_0_50px_var(--gold)] backdrop-blur-xl lg:grid"
      >
        <img src="/logo.png" alt="" width={100} height={100} className="size-24 object-contain" />
      </motion.div>
    </section>
  );
}
