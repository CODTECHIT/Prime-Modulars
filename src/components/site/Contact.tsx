import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, ChevronRight } from "lucide-react";
import { Reveal, SectionLabel } from "./Reveal";
import { CONTACT } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "error";

interface Field {
  name: string;
  phone: string;
  service: string;
  message: string;
}

const SERVICES = [
  "Modular Kitchen",
  "Wardrobes",
  "Living Room",
  "False Ceiling",
  "Pooja Unit",
  "TV Unit",
  "Full Home Interiors",
  "Other",
];

export function Contact() {
  const [field, setField] = useState<Field>({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setField((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Build WhatsApp message
    const msg = `Hello Prime Modulars,%0A%0AName: ${field.name}%0APhone: ${field.phone}%0AService Interested: ${field.service}%0A%0AMessage: ${field.message}`;
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${msg}`, "_blank");
    setStatus("sent");
    setTimeout(() => {
      setStatus("idle");
      setField({ name: "", phone: "", service: "", message: "" });
    }, 3500);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-card py-24 sm:py-36">
      {/* Dividers */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-12">
        {/* Left   Contact info */}
        <Reveal from="left">
          <SectionLabel>Get In Touch</SectionLabel>
          <h2 className="mt-5 text-4xl font-light leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Let's design
            <br />
            your <span className="italic text-primary">dream space.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Visit our studio, call us, or send a message. We respond within 24 hours and offer a
            free first consultation.
          </p>

          <div className="mt-10 space-y-5">
            {/* Phone */}
            <a
              href={`tel:${CONTACT.phoneMain}`}
              className="group flex items-start gap-4 rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/50"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-primary/40 bg-primary">
                <Phone className="size-4 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="label-caps text-muted-foreground">Call Us</p>
                <p className="mt-1 font-sans text-base text-foreground">{CONTACT.phoneMain}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">Alt: {CONTACT.phoneAlt}</p>
              </div>
              <ChevronRight className="ml-auto size-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-1" />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-4 rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/50"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-primary/40 bg-primary">
                <MessageSquare className="size-4 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="label-caps text-muted-foreground">WhatsApp</p>
                <p className="mt-1 text-base text-foreground">Chat with us instantly</p>
                <p className="mt-0.5 text-sm text-muted-foreground">+{CONTACT.whatsapp}</p>
              </div>
              <ChevronRight className="ml-auto size-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-1" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${CONTACT.email}`}
              className="group flex items-start gap-4 rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/50"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-primary/40 bg-primary">
                <Mail className="size-4 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="label-caps text-muted-foreground">Email</p>
                <p className="mt-1 text-base text-foreground">{CONTACT.email}</p>
              </div>
              <ChevronRight className="ml-auto size-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-1" />
            </a>

            {/* Address */}
            <div className="flex items-start gap-4 rounded-xl border border-border bg-background p-5">
              <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-primary/40 bg-primary">
                <MapPin className="size-4 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="label-caps text-muted-foreground">Studio Address</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{CONTACT.address}</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-6 overflow-hidden rounded-xl border border-border h-44 lg:h-56">
            <iframe
              src={CONTACT.mapSrc}
              title="Prime Modulars location map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.5)" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        {/* Right   Form */}
        <Reveal delay={0.15} from="right">
          <div className="rounded-2xl border border-[var(--gold)]/50 bg-background p-7 lg:p-10">
            <h3 className="font-display text-2xl font-light text-foreground lg:text-3xl">
              Send an Enquiry
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill the form we'll open WhatsApp with your message pre-filled.
            </p>

            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-10 flex flex-col items-center justify-center gap-4 py-10 text-center"
                >
                  <CheckCircle2 className="size-14 text-primary" strokeWidth={1} />
                  <p className="font-display text-2xl font-light text-foreground">
                    WhatsApp opened!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your message was sent to WhatsApp. We'll respond shortly.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="label-caps mb-2 block text-muted-foreground">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={field.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-[oklch(0.20_0.006_60)] bg-card px-4 py-3 text-sm text-foreground placeholder:text-[oklch(0.60_0.04_75)/0.5] outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="label-caps mb-2 block text-muted-foreground">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={field.phone}
                      onChange={handleChange}
                      placeholder="+91 9652016213"
                      className="w-full rounded-xl border border-[oklch(0.20_0.006_60)] bg-card px-4 py-3 text-sm text-foreground placeholder:text-[oklch(0.60_0.04_75)/0.5] outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label
                      htmlFor="service"
                      className="label-caps mb-2 block text-muted-foreground"
                    >
                      Service Interested In *
                    </label>
                    <select
                      id="service"
                      name="service"
                      required
                      value={field.service}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[oklch(0.20_0.006_60)] bg-card px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    >
                      <option value="" className="bg-card">
                        Select a service…
                      </option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s} className="bg-card">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="label-caps mb-2 block text-muted-foreground"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={field.message}
                      onChange={handleChange}
                      placeholder="Brief description of your project…"
                      className="w-full resize-none rounded-xl border border-[oklch(0.20_0.006_60)] bg-card px-4 py-3 text-sm text-foreground placeholder:text-[oklch(0.60_0.04_75)/0.5] outline-none transition-all focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-gold w-full justify-center py-3.5 disabled:opacity-60"
                  >
                    {status === "sending" ? (
                      "Opening WhatsApp…"
                    ) : (
                      <>
                        Send via WhatsApp <Send className="size-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-[oklch(0.60_0.04_75)/0.6]">
                    Free consultation · No commitment required
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
