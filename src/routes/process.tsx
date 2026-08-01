import { createFileRoute } from "@tanstack/react-router";
import { Process } from "@/components/site/Process";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";
import { pageHead } from "@/lib/seo";

const TITLE = "Our Process — 3D Design to Precision Craft | Prime Modulars";
const DESC =
  "Discovery, photorealistic 3D design, precision craft and quality handover — see how Prime Modulars delivers your dream interiors in Tadepalli, Guntur.";

export const Route = createFileRoute("/process")({
  head: () => pageHead({ title: TITLE, description: DESC, path: "/process" }),
  component: ProcessPage,
});

function ProcessPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <h1 className="sr-only">Our Process</h1>
      <Process />
    </div>
  );
}
