import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/site/Portfolio";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";
import { pageHead } from "@/lib/seo";

const TITLE = "Portfolio — Modular Kitchens, Wardrobes & Interiors | Prime Modulars";
const DESC =
  "Browse our portfolio of custom modular kitchens, wardrobes, living rooms, bedrooms, ceilings, pooja units and TV units across Guntur, Tadepalli & Vijayawada.";

export const Route = createFileRoute("/portfolio")({
  head: () => pageHead({ title: TITLE, description: DESC, path: "/portfolio" }),
  component: PortfolioPage,
});

function PortfolioPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <h1 className="sr-only">Our Portfolio</h1>
      <Portfolio />
    </div>
  );
}
