"use client";

import { useEffect, useState } from "react";

const stats = [
  { number: "500+", label: "Happy Clients" },
  { number: "8+",   label: "Years of Excellence" },
  { number: "20+",  label: "Expert Services" },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        backgroundColor: "#FDFAF5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "100px 1.5rem 60px",
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", top: "-80px", right: "-80px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(181,72,90,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", left: "-80px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        maxWidth: "900px",
        width: "100%",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.9s ease, transform 0.9s ease",
      }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "11px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "#C9A96E",
          marginBottom: "1.25rem",
        }}>
          Welcome to Amara
        </p>

        {/* Top gold divider */}
        <div style={{
          width: "60px", height: "1px", margin: "0 auto 2rem",
          background: "linear-gradient(90deg, transparent, #C9A96E, transparent)",
        }} />

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(3rem, 8vw, 6.5rem)",
          fontWeight: 300,
          color: "#1C1C1E",
          lineHeight: 1.05,
          marginBottom: "1.5rem",
          letterSpacing: "-0.01em",
        }}>
          Beauty That{" "}
          <span style={{ color: "#B5485A", fontStyle: "italic" }}>Speaks</span>
          <br />
          For Itself
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
          color: "#6B6460",
          lineHeight: 1.9,
          maxWidth: "500px",
          margin: "0 auto 2rem",
          fontWeight: 300,
        }}>
          Premium hair, skin & nail treatments crafted just for you.
          Step in and let us take care of the rest.
        </p>

        {/* Bottom gold divider */}
        <div style={{
          width: "60px", height: "1px", margin: "0 auto 2.5rem",
          background: "linear-gradient(90deg, transparent, #C9A96E, transparent)",
        }} />

        {/* CTA Buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "4rem",
        }}>
          <a
            href="#booking"
            className="hero-primary-btn"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              backgroundColor: "#B5485A",
              color: "#FDFAF5",
              padding: "16px 40px",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.25s ease",
            }}
          >
            Book Appointment
          </a>
          <a
            href="#services"
            className="hero-secondary-btn"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              backgroundColor: "transparent",
              color: "#1C1C1E",
              padding: "16px 40px",
              textDecoration: "none",
              display: "inline-block",
              border: "1.5px solid #1C1C1E",
              transition: "all 0.25s ease",
            }}
          >
            Our Services
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(2rem, 6vw, 5rem)",
          flexWrap: "wrap",
          marginBottom: "4rem",
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 500,
                color: "#B5485A",
                lineHeight: 1,
                marginBottom: "6px",
              }}>
                {stat.number}
              </p>
              <p style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#6B6460",
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}>
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#6B6460",
          }}>
            Scroll
          </p>
          <div style={{
            width: "1px",
            height: "48px",
            backgroundColor: "#C9A96E",
            animation: "scrollPulse 1.8s ease-in-out infinite",
          }} />
        </div>
      </div>

      <style>{`
        .hero-primary-btn:hover {
          background-color: #D4788A !important;
          transform: translateY(-2px);
        }
        .hero-secondary-btn:hover {
          background-color: #1C1C1E !important;
          color: #FDFAF5 !important;
          transform: translateY(-2px);
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50%       { opacity: 1;   transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}