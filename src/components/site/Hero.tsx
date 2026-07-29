import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Play, MapPin, Box, Award, PenTool, Headset } from "lucide-react";
import { Link } from "@tanstack/react-router";

const SLIDES = [
  { src: "/assets/gallery/living-01.jpg", alt: "Luxury living room with geometric wood partition   Guntur residence" },
  { src: "/assets/gallery/living-07.jpg", alt: "Grand living area with beautiful wood ceiling" },
  { src: "/assets/gallery/kitchen-04.jpg", alt: "Luxury modular kitchen with brass lighting" },
  { src: "/assets/gallery/bedroom-06.jpg", alt: "Premium master bedroom with teak headboard" },
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
      className="relative min-h-[100dvh] overflow-hidden bg-background flex flex-col"
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
        {/* Multi-layer gradient overlay for readability - Made slightly darker at the bottom for the card */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#15110E]/80 via-[#15110E]/40 to-[#15110E]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15110E]/90 via-[#15110E]/30 to-[#15110E]/40" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-1 flex-col justify-center px-6 pt-24 pb-8 sm:pt-32 sm:pb-12 lg:px-16 xl:px-24"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col items-start text-left">
          {/* Location & Est */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-white font-semibold tracking-[0.2em] text-xs sm:text-sm uppercase">
              <MapPin className="size-4" />
              <span>Tadepalli • Guntur</span>
            </div>
            <div className="text-gold font-semibold tracking-[0.2em] text-xs sm:text-sm uppercase">
              EST. 2004
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-[2px] w-12 bg-gold mb-6 sm:mb-8 origin-left"
          />

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl text-6xl font-medium leading-[1.1] text-white sm:text-7xl lg:text-[6.5rem] xl:text-[7.5rem] font-display"
          >
            Spaces
            <br />
            Crafted
            <br />
            <span className="block italic text-gold font-light mt-2">With Precision</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="mt-8 max-w-xl text-base sm:text-lg font-medium leading-relaxed text-white drop-shadow-xl"
          >
            Premium modular interiors with full 3D visualization designed and crafted to perfection before a single panel is cut.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="mt-8 flex flex-col items-start sm:flex-row sm:items-center gap-4"
          >
            <Link
              to="/portfolio"
              className="flex items-center justify-center gap-2 rounded-full bg-[#B48E4B] hover:bg-[#9A783E] transition-colors px-8 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase text-white shadow-lg"
            >
              Explore Portfolio <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 rounded-full border border-white px-8 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase text-white transition-all hover:bg-white hover:text-black shadow-lg"
            >
              <Play className="size-4 fill-current" /> Free Consultation
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Features Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative mb-6 sm:mb-12 w-[92%] mx-auto lg:w-[85%] max-w-6xl z-20 shrink-0"
      >
        <div className="bg-[#464039]/90 sm:bg-[#2A2723]/80 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-8 flex flex-row items-stretch justify-between divide-x divide-white/10 shadow-2xl">
          
          <div className="flex flex-col items-center text-center w-1/4 px-1 sm:px-2 group">
            <Box className="size-5 sm:size-10 text-gold mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <h3 className="text-white text-[0.45rem] sm:text-sm font-bold tracking-wider mb-1 uppercase">3D VISUALIZATION</h3>
            <p className="text-white/70 text-[0.45rem] sm:text-xs font-medium leading-tight">See it before<br/> we build it</p>
          </div>

          <div className="flex flex-col items-center text-center w-1/4 px-1 sm:px-2 group">
            <Award className="size-5 sm:size-10 text-gold mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <h3 className="text-white text-[0.45rem] sm:text-sm font-bold tracking-wider mb-1 uppercase">20+ YEARS</h3>
            <p className="text-white/70 text-[0.45rem] sm:text-xs font-medium leading-tight">of experience</p>
          </div>

          <div className="flex flex-col items-center text-center w-1/4 px-1 sm:px-2 group">
            <PenTool className="size-5 sm:size-10 text-gold mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <h3 className="text-white text-[0.45rem] sm:text-sm font-bold tracking-wider mb-1 uppercase">PREMIUM QUALITY</h3>
            <p className="text-white/70 text-[0.45rem] sm:text-xs font-medium leading-tight">Materials &<br/> Workmanship</p>
          </div>

          <div className="flex flex-col items-center text-center w-1/4 px-1 sm:px-2 group">
            <Headset className="size-5 sm:size-10 text-gold mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <h3 className="text-white text-[0.45rem] sm:text-sm font-bold tracking-wider mb-1 uppercase">END TO END</h3>
            <p className="text-white/70 text-[0.45rem] sm:text-xs font-medium leading-tight">Support</p>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
