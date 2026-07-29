import { createFileRoute } from "@tanstack/react-router";
import { Testimonials } from "@/components/site/Testimonials";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";

export const Route = createFileRoute("/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <Testimonials />
    </div>
  );
}
