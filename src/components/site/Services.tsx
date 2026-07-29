import { ChefHat, DoorOpen, Tv, Columns3, Flame, Box, ArrowRight } from "lucide-react";
import { Reveal, SectionLabel } from "./Reveal";
import { scrollToId } from "./useSmoothScroll";
import type { GalleryCategory } from "@/data/site";
import { useNavigate } from "@tanstack/react-router";

const SERVICES: Array<{
  icon: any;
  title: string;
  text: string;
  image: string;
  num: string;
  portfolioCategory: GalleryCategory;
}> = [
  {
    icon: ChefHat,
    title: "Modular Kitchen",
    text: "Ergonomic, elegant kitchens tailored to how you cook and live.",
    image: "/assets/gallery/kitchen-01.jpg",
    num: "01",
    portfolioCategory: "Kitchens",
  },
  {
    icon: DoorOpen,
    title: "Wardrobes",
    text: "Space-smart wardrobe solutions with premium laminates.",
    image: "/assets/gallery/wardrobe-01.jpg",
    num: "02",
    portfolioCategory: "Wardrobes",
  },
  {
    icon: Tv,
    title: "TV Units",
    text: "Statement media walls and floating TV units.",
    image: "/assets/gallery/tv-unit-01.jpg",
    num: "03",
    portfolioCategory: "TV Units",
  },
  {
    icon: Columns3,
    title: "Hall Partition",
    text: "Stylish dividers that add privacy without closing off space.",
    image: "/assets/gallery/entryway-01.jpg",
    num: "04",
    portfolioCategory: "Entryway",
  },
  {
    icon: Flame,
    title: "Pooja Units",
    text: "Serene, beautifully detailed prayer spaces.",
    image: "/assets/gallery/pooja-02.jpg",
    num: "05",
    portfolioCategory: "Pooja Units",
  },
  {
    icon: Box,
    title: "3D Designing",
    text: "Photorealistic 3D renders that help you visualize your space.",
    image: "/assets/gallery/ceiling-04.jpg",
    num: "06",
    portfolioCategory: "All",
  },
];

export function Services() {
  const navigate = useNavigate();

  const handleSelectService = (category: GalleryCategory) => {
    // Navigate to the portfolio page, passing the category as a hash
    navigate({ to: "/portfolio", hash: category });
  };

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
              View All <ArrowRight className="size-4" />
            </button>
          </div>
        </Reveal>

        {/* Services grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <article
                className="group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-[#FDFBF7] p-3 sm:p-5 shadow-sm border border-border/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
                onClick={() => handleSelectService(s.portfolioCategory)}
              >
                {/* Header: Icon + Title */}
                <div className="mb-3 sm:mb-5 flex flex-row items-center gap-3 sm:gap-4">
                  <div className="grid size-8 sm:size-12 shrink-0 place-items-center text-primary">
                    <s.icon className="size-6 sm:size-8" strokeWidth={1.2} />
                  </div>
                  <h3 className="font-sans text-[0.65rem] sm:text-sm font-bold uppercase tracking-wider text-foreground leading-snug w-full sm:w-32">
                    {s.title.split(' ').map((word, idx) => <span key={idx} className="block">{word}</span>)}
                  </h3>
                </div>

                {/* Image Area */}
                <div className="relative h-[140px] sm:h-[220px] w-full rounded-xl sm:rounded-2xl overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Arrow Button */}
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 flex size-8 sm:size-12 items-center justify-center rounded-full bg-[#FDFBF7] shadow-sm text-primary transition-transform group-hover:scale-110">
                    <div className="flex size-6 sm:size-8 items-center justify-center rounded-full bg-white shadow-sm border border-primary/10">
                       <ArrowRight className="size-3 sm:size-4" />
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Full Width CTA card */}
        <div className="mt-8 sm:mt-12">
          <Reveal delay={0.2}>
            <div
              className="relative flex min-h-[280px] w-full flex-col justify-end overflow-hidden rounded-[2rem] p-8 sm:p-12 cursor-pointer"
              style={{
                background: "linear-gradient(145deg, #18181A, #0A0A0B)",
                border: "1px solid var(--primary)",
              }}
              onClick={() => scrollToId("contact")}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute top-12 right-12 opacity-10"
              >
                 <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                   <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                     <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                   </pattern>
                   <rect width="100" height="100" fill="url(#grid)" className="text-[var(--primary)]" />
                 </svg>
              </div>
              <h3 className="relative z-10 font-display text-4xl font-light text-white sm:text-5xl">
                Bring Your Dream Space
                <br />
                <span className="italic text-primary">to Life</span>
              </h3>
              <p className="relative z-10 mt-4 max-w-md text-base text-gray-300">
                Get personalized designs and expert guidance.
              </p>
              <button
                className="relative z-10 mt-8 self-start rounded-md bg-[var(--gold)] px-6 py-3 font-semibold text-white transition-all hover:bg-[var(--gold-muted)] flex items-center gap-2"
                onClick={(e) => { e.stopPropagation(); scrollToId("contact"); }}
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
