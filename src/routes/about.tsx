import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/About";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";
import { pageHead } from "@/lib/seo";

const TITLE = "About Us | Prime Modulars — Premium Modular Interiors in Tadepalli, Guntur";
const DESC =
  "Learn about Prime Modulars, the Tadepalli modular kitchen and interior specialists with 20+ years of 3D-designed craftsmanship since 2004.";

export const Route = createFileRoute("/about")({
  head: () => pageHead({ title: TITLE, description: DESC, path: "/about" }),
  component: AboutPage,
});

function AboutPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <h1 className="sr-only">About Prime Modulars</h1>
      <About />
    </div>
  );
}
