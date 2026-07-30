import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/site/Services";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
});

function ServicesPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <Services />
    </div>
  );
}
