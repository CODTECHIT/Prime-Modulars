import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/site/Services";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";
import { pageHead } from "@/lib/seo";

const TITLE = "Modular Kitchens, Wardrobes, TV Units & More | Prime Modulars";
const DESC =
  "Modular kitchens, wardrobes, TV units, hall partitions, pooja units and photorealistic 3D interior design in Tadepalli, Guntur & Vijayawada.";

export const Route = createFileRoute("/services")({
  head: () => pageHead({ title: TITLE, description: DESC, path: "/services" }),
  component: ServicesPage,
});

function ServicesPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <h1 className="sr-only">Our Services</h1>
      <Services />
    </div>
  );
}
