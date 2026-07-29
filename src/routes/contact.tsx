import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/Contact";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <Contact />
    </div>
  );
}
