import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/site/Portfolio";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
});

function PortfolioPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <Portfolio />
    </div>
  );
}
