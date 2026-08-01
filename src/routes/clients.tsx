import { createFileRoute } from "@tanstack/react-router";
import { Testimonials } from "@/components/site/Testimonials";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";
import { pageHead } from "@/lib/seo";

const TITLE = "Client Stories & Testimonials | Prime Modulars Interiors";
const DESC =
  "Read reviews from homeowners in Tadepalli, Guntur, Mangalagiri & Vijayawada about Prime Modulars' kitchen, wardrobe and full-home interior projects.";

export const Route = createFileRoute("/clients")({
  head: () => pageHead({ title: TITLE, description: DESC, path: "/clients" }),
  component: ClientsPage,
});

function ClientsPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <h1 className="sr-only">Client Stories</h1>
      <Testimonials />
    </div>
  );
}
