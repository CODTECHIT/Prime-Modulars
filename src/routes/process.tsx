import { createFileRoute } from "@tanstack/react-router";
import { Process } from "@/components/site/Process";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";

export const Route = createFileRoute("/process")({
  component: ProcessPage,
});

function ProcessPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <Process />
    </div>
  );
}
