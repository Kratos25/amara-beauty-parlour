"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  {
    icon: "✦",
    title: "Hair Care",
    description: "From precision cuts to luxurious treatments, we craft styles that enhance your natural beauty.",
    items: ["Hair Cut & Styling", "Keratin Treatment", "Hair Colouring", "Deep Conditioning"],
    accent: "#B5485A",
  },
  {
    icon: "◈",
    title: "Skin & Facials",
    description: "Rejuvenating facials and skin treatments tailored to your skin type and concerns.",
    items: ["Hydra Facial", "Anti-Aging Treatment", "Cleanup & Bleach", "De-Tan Facial"],
    accent: "#C9A96E",
  },
  {
    icon: "❋",
    title: "Nail Studio",
    description: "Impeccable nail care with premium products for hands and feet that deserve attention.",
    items: ["Gel Manicure", "Nail Art & Extensions", "Pedicure Spa", "French Polish"],
    accent: "#B5485A",
  },
  {
    icon: "◇",
    title: "Bridal & Makeup",
    description: "Your big day deserves flawless beauty. We create looks that last from ceremony to celebration.",
    items: ["Bridal Makeup", "Party Makeup", "Saree Draping", "Pre-Bridal Package"],
    accent: "#C9A96E",
  },
  {
    icon: "✿",
    title: "Waxing & Threading",
    description: "Smooth, lasting results with gentle techniques that leave your skin soft and radiant.",
    items: ["Full Body Waxing", "Eyebrow Threading", "Upper Lip & Face", "Rica Wax"],
    accent: "#B5485A",
  },
  {
    icon: "◉",
    title: "Wellness & Spa",
    description: "Unwind with our calming body and wellness therapies designed to restore balance.",
    items: ["Body Polishing", "Head Massage", "Foot Reflexology", "Aromatherapy"],
    accent: "#C9A96E",
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#1C1C1E" : "#FFFFFF",
        border: `1px solid ${hovered ? "#1C1C1E" : "#F0E8DF"}`,
        padding: "2.5rem 2rem",
        transition: "all 0.35s ease",
        cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${index * 80}ms`,
        transitionProperty: "opacity, transform, background-color, border-color",
      }}
    >
      {/* Icon */}
      <div style={{
        fontSize: "1.6rem",
        color: hovered ? service.accent : service.accent,
        marginBottom: "1.25rem",
        transition: "color 0.3s ease",
      }}>
        {service.icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--font-cormorant)",
        fontSize: "1.6rem",
        fontWeight: 500,
        color: hovered ? "#FDFAF5" : "#1C1C1E",
        marginBottom: "0.75rem",
        transition: "color 0.3s ease",
        lineHeight: 1.2,
      }}>
        {service.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: "var(--font-dm-sans)",
        fontSize: "0.85rem",
        color: hovered ? "#A89E98" : "#6B6460",
        lineHeight: 1.75,
        marginBottom: "1.5rem",
        fontWeight: 300,
        transition: "color 0.3s ease",
      }}>
        {service.description}
      </p>

      {/* Divider */}
      <div style={{
        width: "40px",
        height: "1px",
        background: `linear-gradient(90deg, ${service.accent}, transparent)`,
        marginBottom: "1.25rem",
        transition: "width 0.3s ease",
      }} />

      {/* Service items */}
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {service.items.map((item) => (
          <li
            key={item}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: hovered ? "#D4C8C2" : "#6B6460",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "color 0.3s ease",
            }}
          >
            <span style={{ color: service.accent, fontSize: "8px" }}>◆</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Services() {
  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.3 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      style={{
        backgroundColor: "#F9F5F0",
        padding: "7rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Section Header */}
        <div
          ref={titleRef}
          style={{
            textAlign: "center",
            marginBottom: "5rem",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "11px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#C9A96E",
            marginBottom: "1rem",
          }}>
            What We Offer
          </p>

          <div style={{
            width: "50px", height: "1px", margin: "0 auto 1.5rem",
            background: "linear-gradient(90deg, transparent, #C9A96E, transparent)",
          }} />

          <h2 style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 300,
            color: "#1C1C1E",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}>
            Our <span style={{ color: "#B5485A", fontStyle: "italic" }}>Signature</span> Services
          </h2>

          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.95rem",
            color: "#6B6460",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.8,
            fontWeight: 300,
          }}>
            Every treatment is performed by skilled professionals using
            premium products — because you deserve nothing less.
          </p>
        </div>

        {/* Services Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}>
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <a
            href="#booking"
            className="services-cta"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              backgroundColor: "#B5485A",
              color: "#FDFAF5",
              padding: "16px 48px",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.25s ease",
            }}
          >
            Book a Service
          </a>
        </div>
      </div>

      <style>{`
        .services-cta:hover {
          background-color: #D4788A !important;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}