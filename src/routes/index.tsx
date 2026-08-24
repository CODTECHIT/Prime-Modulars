import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Portfolio } from "@/components/site/Portfolio";
import { Process } from "@/components/site/Process";
import { Testimonials, TESTIMONIALS } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";

import { useSmoothScroll } from "@/components/site/useSmoothScroll";

import { SITE_URL, OG_IMAGE_URL, pageHead } from "@/lib/seo";
import { CONTACT } from "@/data/site";

const TITLE = "Prime Modulars | Premium Modular Interiors in Tadepalli, Guntur";
const DESC =
  "Premium custom modular kitchens, wardrobes, TV units, pooja units, ceilings and full home interiors in Tadepalli, Guntur. 20+ years of 3D-designed craftsmanship since 2004.";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Prime Modulars Company",
  url: `${SITE_URL}/`,
  logo: OG_IMAGE_URL,
  image: OG_IMAGE_URL,
  description: DESC,
  email: CONTACT.email,
  telephone: `+91 ${CONTACT.phoneMain}`,
  vatID: CONTACT.gstin,
  taxID: CONTACT.gstin,
  foundingDate: "2004",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Door No: 12-158/1, Road No: 20, Mahanadu, Tadepalli",
    addressLocality: "Tadepalli",
    addressRegion: "Andhra Pradesh",
    postalCode: "522501",
    addressCountry: "IN",
  },
  areaServed: ["Tadepalli", "Guntur", "Vijayawada", "Mangalagiri"],
  sameAs: [`https://wa.me/${CONTACT.whatsapp}`],
  review: TESTIMONIALS.map((t) => ({
    "@type": "Review",
    author: { "@type": "Person", name: t.name },
    reviewBody: t.quote,
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({ title: TITLE, description: DESC, path: "/" }),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusinessSchema) }],
  }),
  component: Index,
});

function Index() {
  useSmoothScroll();

  return (
    <main className="pb-16 lg:pb-0">
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Process />
      <Testimonials />
      <Contact />
    </main>
  );
}
