"use client";

import { useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";

function useInView(threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const { ref: headRef, visible: headVisible } = useInView(0.3);
  const { ref: bodyRef, visible: bodyVisible } = useInView(0.2);
  const [testimonials, setTestimonials] = useState<{name: string; service: string; review: string; rating: number; initial: string;}[]>([]);

  const goTo = (index: number) => {
    if (index === active || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(index);
      setAnimating(false);
    }, 300);
  };

  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((active + 1) % testimonials.length);

  const t = testimonials[active];

  useEffect(() => {
    if (active >= testimonials.length && testimonials.length > 0) {
      setActive(0);
    }
  }, [testimonials, active]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.testimonials));
        const data = snap.docs
          .map(d => d.data() as { name: string; service: string; review: string; rating: number; initial: string; active: boolean })
          .filter(d => d.active === true);
        if (data.length > 0) setTestimonials(data);
      } catch (err) {
        console.error("Testimonials fetch error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <section
      id="testimonials"
      style={{
        backgroundColor: "#FDFAF5",
        padding: "7rem 1.5rem",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        ref={headRef}
        style={{
          textAlign: "center",
          marginBottom: "5rem",
          opacity: headVisible ? 1 : 0,
          transform: headVisible ? "translateY(0)" : "translateY(20px)",
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
          Client Love
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
        }}>
          Words From Our{" "}
          <span style={{ color: "#B5485A", fontStyle: "italic" }}>Clients</span>
        </h2>
      </div>

      {/* ── Main Testimonial Card ── */}
      <div
        ref={bodyRef}
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          opacity: bodyVisible ? 1 : 0,
          transform: bodyVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* Large quote mark */}
        <div style={{
          textAlign: "center",
          fontFamily: "var(--font-cormorant)",
          fontSize: "8rem",
          color: "#B5485A",
          opacity: 0.12,
          lineHeight: 0.5,
          marginBottom: "2rem",
          userSelect: "none",
        }}>
          "
        </div>

        {/* Review text */}
        {!t ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "#6B6460" }}>
              Loading testimonials...
            </p>
          </div>
        ) : (
        <div style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(10px)" : "translateY(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 300,
            color: "#1C1C1E",
            lineHeight: 1.65,
            marginBottom: "3rem",
            fontStyle: "italic",
            maxWidth: "720px",
            margin: "0 auto 3rem",
          }}>
            {t.review}
          </p>

          {/* Stars */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "4px",
            marginBottom: "1.5rem",
          }}>
            {Array.from({ length: t.rating }).map((_, i) => (
              <span key={i} style={{ color: "#C9A96E", fontSize: "0.9rem" }}>★</span>
            ))}
          </div>

          {/* Gold divider */}
          <div style={{
            width: "40px", height: "1px", margin: "0 auto 1.5rem",
            background: "linear-gradient(90deg, transparent, #C9A96E, transparent)",
          }} />

          {/* Avatar + Name */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "#B5485A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.4rem",
              color: "#FDFAF5",
              fontWeight: 500,
              marginBottom: "0.5rem",
            }}>
              {t.initial}
            </div>
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.2rem",
              fontWeight: 500,
              color: "#1C1C1E",
              letterSpacing: "0.03em",
            }}>
              {t.name}
            </p>
            <p style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C9A96E",
            }}>
              {t.service}
            </p>
          </div>
        </div>
        )}

        {/* ── Navigation ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          marginTop: "3.5rem",
        }}>
          {/* Prev */}
          <button
            onClick={prev}
            className="testimonial-arrow"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid #E0D5CE",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B6460",
              fontSize: "1rem",
              transition: "all 0.2s ease",
            }}
          >
            ←
          </button>

          {/* Dots */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === active ? "24px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  backgroundColor: i === active ? "#B5485A" : "#D4C8C2",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="testimonial-arrow"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid #E0D5CE",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B6460",
              fontSize: "1rem",
              transition: "all 0.2s ease",
            }}
          >
            →
          </button>
        </div>

        {/* ── All client dots row ── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "3rem",
          flexWrap: "wrap",
        }}>
          {testimonials.map((item, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: i === active ? "#B5485A" : "#F0E8DF",
                border: i === active ? "2px solid #B5485A" : "2px solid transparent",
                cursor: "pointer",
                fontFamily: "var(--font-cormorant)",
                fontSize: "0.9rem",
                color: i === active ? "#FDFAF5" : "#6B6460",
                fontWeight: 500,
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.initial}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .testimonial-arrow:hover {
          background-color: #B5485A !important;
          border-color: #B5485A !important;
          color: #FDFAF5 !important;
        }
      `}</style>
    </section>
  );
}