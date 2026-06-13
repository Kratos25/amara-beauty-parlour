"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";

const categories = ["All", "Hair", "Skin", "Nails", "Bridal", "Makeup"];

function useInView(threshold = 0.1) {
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

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<{ src: string; category: string; span: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { ref: headRef, visible: headVisible } = useInView(0.3);
  const { ref: gridRef, visible: gridVisible } = useInView(0.1);

  const filtered = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  // Close lightbox on Escape

  useEffect(() => {
    const fetchGallery = async () => {
      const snap = await getDocs(collection(db, COLLECTIONS.gallery));
      const data = snap.docs.map((d, i) => ({
        src: d.data().url,
        category: d.data().category,
        span: i % 5 === 0 ? "tall" : i % 3 === 0 ? "wide" : "normal",
      }));
      setGalleryItems(data);
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section
      id="gallery"
      style={{
        backgroundColor: "#F9F5F0",
        padding: "7rem 1.5rem",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        ref={headRef}
        style={{
          textAlign: "center",
          marginBottom: "4rem",
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
          Our Work
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
          marginBottom: "3rem",
        }}>
          Beauty We've{" "}
          <span style={{ color: "#B5485A", fontStyle: "italic" }}>Created</span>
        </h2>

        {/* Category filter tabs */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "10px 24px",
                border: "1px solid",
                borderColor: activeCategory === cat ? "#B5485A" : "#D4C8C2",
                backgroundColor: activeCategory === cat ? "#B5485A" : "transparent",
                color: activeCategory === cat ? "#FDFAF5" : "#6B6460",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Masonry Grid ── */}
      <div
        ref={gridRef}
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          columns: "3 280px",
          columnGap: "1rem",
          opacity: gridVisible ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {filtered.map((item, i) => (
          <div
            key={item.src}
            onClick={() => setLightbox(item.src)}
            className="gallery-item"
            style={{
              breakInside: "avoid",
              marginBottom: "1rem",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              height: item.span === "tall" ? "420px" : item.span === "wide" ? "280px" : "320px",
              opacity: gridVisible ? 1 : 0,
              transform: gridVisible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`,
              backgroundColor: "#E8DDD5",
            }}
          >
            <Image
              src={item.src}
              alt={item.category}
              fill
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              className="gallery-img"
            />

            {/* Hover overlay */}
            <div
              className="gallery-overlay"
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(181,72,90,0.75)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                opacity: 0,
                transition: "opacity 0.35s ease",
              }}
            >
              <span style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "2rem",
                color: "#FDFAF5",
                lineHeight: 1,
              }}>
                +
              </span>
              <p style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "9px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(253,250,245,0.85)",
              }}>
                {item.category}
              </p>
            </div>

            {/* Category tag */}
            <div style={{
              position: "absolute",
              top: "0.75rem",
              left: "0.75rem",
              backgroundColor: "rgba(28,28,30,0.6)",
              backdropFilter: "blur(4px)",
              padding: "4px 10px",
            }}>
              <p style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "8px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A96E",
              }}>
                {item.category}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.92)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "pointer",
          }}
        >
          <div style={{
            position: "relative",
            maxWidth: "900px",
            maxHeight: "85vh",
            width: "100%",
            aspectRatio: "3/4",
          }}>
            <Image
              src={lightbox}
              alt="Gallery"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid rgba(253,250,245,0.2)",
              backgroundColor: "transparent",
              color: "#FDFAF5",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            className="lightbox-close"
          >
            ✕
          </button>
        </div>
      )}

      <style>{`
        .gallery-item:hover .gallery-overlay { opacity: 1 !important; }
        .gallery-item:hover .gallery-img { transform: scale(1.06); }
        .lightbox-close:hover {
          background-color: #B5485A !important;
          border-color: #B5485A !important;
        }

        @media (max-width: 768px) {
          .gallery-masonry { columns: 2 !important; }
        }
        @media (max-width: 480px) {
          .gallery-masonry { columns: 1 !important; }
        }
      `}</style>
    </section>
  );
}