import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/site/Services";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";

export const Route = createFileRoute("/expertise")({
  component: ExpertisePage,
});

function ExpertisePage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <Services />
    </div>
  );
}
