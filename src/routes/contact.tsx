import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/Contact";
import { useSmoothScroll } from "@/components/site/useSmoothScroll";
import { pageHead } from "@/lib/seo";

const TITLE = "Contact Us — Free Consultation | Prime Modulars Tadepalli, Guntur";
const DESC =
  "Contact Prime Modulars for a free first consultation. Call 9652016213 or WhatsApp +91 9652016213 — studio in Tadepalli, Guntur, Andhra Pradesh.";

export const Route = createFileRoute("/contact")({
  head: () => pageHead({ title: TITLE, description: DESC, path: "/contact" }),
  component: ContactPage,
});

function ContactPage() {
  useSmoothScroll();
  return (
    <div className="pt-24">
      <h1 className="sr-only">Contact Prime Modulars</h1>
      <Contact />
    </div>
  );
}
