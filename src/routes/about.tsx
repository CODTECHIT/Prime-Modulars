import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/About";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <About />
    </div>
  );
}
