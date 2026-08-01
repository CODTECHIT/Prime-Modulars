import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn, ChevronLeft, ChevronRight, Loader2, Phone, MessageSquare } from "lucide-react";
import { Reveal, SectionLabel } from "./Reveal";
import {
  GALLERY,
  GALLERY_CATEGORIES,
  CONTACT,
  type GalleryCategory,
  type GalleryItem,
} from "@/data/site";
import { getGalleryImages, type GalleryImage } from "@/lib/server/gallery";
import { withCache } from "@/lib/cache";

const ALL_CATS = GALLERY_CATEGORIES;

function BeforeAfterImage({
  beforeSrc,
  afterSrc,
  alt,
  className = "",
  imgClass = "object-cover",
  onLoad,
}: {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
  className?: string;
  imgClass?: string;
  onLoad?: () => void;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    if (!isLoaded) {
      setIsLoaded(true);
      onLoad?.();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={afterSrc}
        alt=""
        className={`block w-full h-full opacity-0 pointer-events-none ${imgClass}`}
        onLoad={handleLoad}
      />
      <img
        src={afterSrc}
        alt={`${alt} After`}
        className={`absolute inset-0 w-full h-full ${imgClass}`}
      />
      <img
        src={beforeSrc}
        alt={`${alt} Before`}
        className={`absolute inset-0 w-full h-full ${imgClass}`}
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />
      <div
        className="absolute top-0 bottom-0 w-0.5 md:w-1 bg-white pointer-events-none z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 md:size-8 bg-white rounded-full shadow-lg grid place-items-center">
          <ChevronLeft className="size-3 md:size-4 absolute left-0.5 md:left-1 text-gray-500" />
          <ChevronRight className="size-3 md:size-4 absolute right-0.5 md:right-1 text-gray-500" />
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
      />
      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider pointer-events-none z-10">
        Before
      </div>
      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider pointer-events-none z-10">
        After
      </div>
    </div>
  );
}

function GalleryCard({
  item,
  index,
  onClick,
}: {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Reveal delay={(index % 6) * 0.07}>
      <button
        onClick={onClick}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        aria-label={`View ${item.caption}`}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-card">
            <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
          </div>
        )}
        {item.type === "video" ? (
          <video
            src={item.src}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            onLoadedData={() => setLoaded(true)}
            className={`size-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        ) : item.beforeSrc ? (
          <BeforeAfterImage
            beforeSrc={item.beforeSrc}
            afterSrc={item.src}
            alt={item.caption}
            onLoad={() => setLoaded(true)}
            className={`size-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <img
            src={item.src}
            alt={item.caption}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`size-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        )}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[oklch(0.04_0.005_60/0.85)] via-[oklch(0.04_0.005_60/0.2)] to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-focus-visible:opacity-100">
          <div className="flex items-end justify-between p-4">
            <p className="text-left text-xs leading-snug text-foreground font-medium">
              {item.caption}
            </p>
            <span className="ml-2 grid shrink-0 size-8 place-items-center rounded-full border border-[var(--primary)] text-primary">
              <ZoomIn className="size-3.5" />
            </span>
          </div>
        </div>
      </button>
    </Reveal>
  );
}

function Lightbox({
  items,
  startIndex,
  onClose,
}: {
  items: GalleryItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [loaded, setLoaded] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const item = items[index];

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length],
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    setLoaded(false);
    setShowContact(false);
  }, [index]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[oklch(0.04_0.005_60/0.97)] backdrop-blur-md" />

      <div
        className="relative z-10 mx-4 flex max-h-[90svh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-xl border border-[var(--primary)] cursor-pointer"
              onClick={() => setShowContact(true)}
            >
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                  <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
                </div>
              )}
              {item.type === "video" ? (
                <video
                  src={item.src}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedData={() => setLoaded(true)}
                  className={`block max-h-[75svh] max-w-[88vw] ${loaded ? "opacity-100" : "opacity-0"}`}
                />
              ) : item.beforeSrc ? (
                <BeforeAfterImage
                  beforeSrc={item.beforeSrc}
                  afterSrc={item.src}
                  alt={item.caption}
                  onLoad={() => setLoaded(true)}
                  className={`block max-h-[75svh] max-w-[88vw] h-[75svh] md:h-[80svh] aspect-video md:aspect-[4/3] ${loaded ? "opacity-100" : "opacity-0"}`}
                  imgClass="object-cover md:object-contain"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.caption}
                  onLoad={() => setLoaded(true)}
                  className={`block max-h-[75svh] max-w-[88vw] object-contain ${loaded ? "opacity-100" : "opacity-0"}`}
                />
              )}

              {!showContact && loaded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none"
                >
                  <span className="bg-black/70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2">
                    <span className="animate-pulse block size-1.5 rounded-full bg-primary" />
                    Tap image to explore
                  </span>
                </motion.div>
              )}

              <AnimatePresence>
                {showContact && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-5 p-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowContact(false);
                    }}
                  >
                    <h3 className="text-white text-xl sm:text-2xl font-display mb-1 text-center">
                      Interested in this design?
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                      <a
                        href={`tel:${CONTACT.phoneMain}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--gold)] text-white px-4 py-3 text-sm font-medium transition-transform hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="size-4" />
                        Call Now
                      </a>
                      <a
                        href={`https://wa.me/${CONTACT.whatsapp}?text=Hello%2C%20I'm%20interested%20in%20the%20${encodeURIComponent(item.category)}%20design%20(${encodeURIComponent(item.caption)}).`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 text-sm font-medium transition-transform hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageSquare className="size-4" />
                        WhatsApp
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 flex w-full items-center justify-between">
          <p className="max-w-sm text-sm text-foreground/90">{item.caption}</p>
          <span className="label-caps shrink-0 text-[var(--primary)] ml-4">
            {index + 1} / {items.length}
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-6 right-6 z-[110] grid size-10 place-items-center rounded-full border border-primary/40 bg-[var(--card)] text-foreground/90 transition-all hover:border-primary hover:text-primary hover:scale-110"
      >
        <X className="size-4" />
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 grid size-10 sm:size-12 place-items-center rounded-full border border-primary/40 bg-[var(--card)] text-foreground/90 transition-all hover:border-primary hover:text-primary hover:scale-110"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 grid size-10 sm:size-12 place-items-center rounded-full border border-primary/40 bg-[var(--card)] text-foreground/90 transition-all hover:border-primary hover:text-primary hover:scale-110"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
    </motion.div>
  );
}

const PAGE_SIZE = 12;

function useGalleryItems() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    setItems(GALLERY);

    withCache("gallery_images", () => getGalleryImages({}), 5 * 60 * 1000)
      .then((imgs: GalleryImage[]) => {
        if (imgs.length > 0) {
          setItems(
            imgs.map((img) => ({
              type: img.type ?? "image",
              src: img.src,
              beforeSrc: img.beforeSrc,
              category: img.category as Exclude<GalleryCategory, "All">,
              caption: img.caption,
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  return { items };
}

export function Portfolio() {
  const { items: galleryItems } = useGalleryItems();
  const dynamicCats = ["All", ...Array.from(new Set(galleryItems.map((item) => item.category)))];

  const [cat, setCat] = useState<GalleryCategory>(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hashCat = decodeURIComponent(window.location.hash.replace("#", ""));
      return hashCat as GalleryCategory;
    }
    return "All";
  });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<{ items: GalleryItem[]; index: number } | null>(null);

  const filtered = cat === "All" ? galleryItems : galleryItems.filter((g) => g.category === cat);
  const shown = filtered.slice(0, visible);

  const openLightbox = (index: number) => setLightbox({ items: filtered, index });

  const handleCatChange = (c: GalleryCategory) => {
    setCat(c);
    setVisible(PAGE_SIZE);
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const hashCat = decodeURIComponent(window.location.hash.replace("#", ""));
        setCat(hashCat as GalleryCategory);
        setVisible(PAGE_SIZE);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <section id="portfolio" className="relative overflow-hidden bg-background py-24 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal>
          <SectionLabel>Portfolio</SectionLabel>
          <h2 className="mt-5 max-w-xl text-4xl font-light leading-tight text-foreground sm:text-6xl">
            Crafted spaces,
            <br />
            <span className="italic text-primary">real results.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2">
            {["All", ...Array.from(new Set(galleryItems.map((item) => item.category)))].map((c) => (
              <button
                key={c}
                onClick={() => handleCatChange(c as GalleryCategory)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                  cat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-[var(--primary)] text-muted-foreground hover:border-[var(--primary)] hover:text-foreground/90"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {shown.map((item, i) => (
            <GalleryCard
              key={`${item.src}-${i}`}
              item={item}
              index={i}
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>

        {visible < filtered.length && (
          <Reveal>
            <div className="mt-12 flex justify-center">
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-outline">
                Load More ({filtered.length - visible} remaining)
              </button>
            </div>
          </Reveal>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            items={lightbox.items}
            startIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
