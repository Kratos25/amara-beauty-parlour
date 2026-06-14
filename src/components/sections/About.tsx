"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function useInView(threshold = 0.12) {
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

const stats = [
  { n: "2000+", l: "Clients Served" },
  { n: "12+",   l: "Years of Practice" },
  { n: "200+", l: "Bridal Looks" },
  { n: "100%", l: "Personal Attention" },
];

const values = [
  "Premium Products",
  "Expert Hands",
  "Bridal Specialists",
  "Hygienic Space",
  "Lasting Results",
  "Your Comfort",
];

export default function About() {
  const { ref: imgRef,  visible: imgVisible  } = useInView(0.05);
  const { ref: textRef, visible: textVisible } = useInView(0.1);
  const { ref: botRef,  visible: botVisible  } = useInView(0.1);

  return (
    <section id="about" style={{ backgroundColor: "#0D0A0B", overflow: "hidden" }}>

      {/* ══════════════════════════════════════════
          SPREAD — portrait left / story right
      ══════════════════════════════════════════ */}
      <div className="spread-grid">

        {/* ── LEFT: Full portrait ── */}
        <div
          ref={imgRef}
          className="portrait-panel"
          style={{
            opacity: imgVisible ? 1 : 0,
            transition: "opacity 1.2s ease",
          }}
        >
          <Image
            src="/images/about_2.jpeg"
            alt="Founder of Amara Beauty Parlour"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority
          />

          {/* Warm duotone wash */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(150deg, rgba(181,72,90,0.15) 0%, rgba(201,169,110,0.08) 55%, rgba(13,10,11,0.5) 100%)",
          }} />

          {/* Right-edge fade into content panel (desktop) */}
          <div className="portrait-fade-right" style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, transparent 55%, #0D0A0B 100%)",
          }} />

          {/* Bottom fade (mobile) */}
          <div className="portrait-fade-bottom" style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 50%, #0D0A0B 100%)",
          }} />

          {/* Est. ghost text */}
          <div style={{
            position: "absolute",
            top: "clamp(1.5rem, 3vw, 2.5rem)",
            left: "clamp(1.5rem, 3vw, 2.5rem)",
          }}>
            {/* <span style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#C9A96E",
              display: "block",
              marginBottom: "2px",
            }}>Est.</span>
            <span style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 300,
              color: "rgba(253,250,245,0.1)",
              lineHeight: 1,
              display: "block",
            }}>2016</span> */}
          </div>

          {/* Pull-quote over image */}
          <div
            className="pull-quote"
            style={{
              position: "absolute",
              bottom: "clamp(2rem, 4vw, 3.5rem)",
              left: "clamp(1.5rem, 3vw, 2.5rem)",
              right: "22%",
              opacity: imgVisible ? 1 : 0,
              transform: imgVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s",
            }}
          >
            <div style={{
              width: "28px", height: "1px", marginBottom: "0.9rem",
              background: "linear-gradient(90deg, #C9A96E, transparent)",
            }} />
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#FDFAF5",
              lineHeight: 1.5,
              margin: 0,
            }}>
              "I never dreamed about success.<br />
              I worked for it."
            </p>
          </div>
        </div>

        {/* ── RIGHT: Story content ── */}
        <div
          ref={textRef}
          className="story-panel"
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateX(0)" : "translateX(24px)",
            transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
          }}
        >
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "10px",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "#C9A96E",
            marginBottom: "1.5rem",
          }}>
            The Woman Behind Amara
          </p>

          <h2 style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.4rem, 4vw, 4.2rem)",
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            margin: "0 0 2rem",
            color: "#FDFAF5",
          }}>
            Crafted with{" "}
            <span style={{ color: "#B5485A", fontStyle: "italic" }}>Heart,</span>
            <br />
            Delivered with Skill
          </h2>

          <div style={{
            width: "48px", height: "1px", marginBottom: "2rem",
            background: "linear-gradient(90deg, #C9A96E, transparent)",
          }} />

          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(0.82rem, 1.1vw, 0.92rem)",
            color: "rgba(253,250,245,0.55)",
            lineHeight: 2,
            fontWeight: 300,
            marginBottom: "1.2rem",
            maxWidth: "440px",
          }}>
            With over eight years behind the chair, our founder built Amara
            from a single belief — that every woman, regardless of the
            occasion, deserves to feel seen, cared for, and beautiful in
            her own skin.
          </p>
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(0.82rem, 1.1vw, 0.92rem)",
            color: "rgba(253,250,245,0.55)",
            lineHeight: 2,
            fontWeight: 300,
            marginBottom: "2.5rem",
            maxWidth: "440px",
          }}>
            Trained in advanced bridal makeup, hair artistry, and skincare,
            she personally oversees every service. Amara isn't a chain —
            it's her life's work, and it shows in every detail.
          </p>

          {/* Stats 2×2 */}
          <div className="stats-grid" style={{ marginBottom: "2.5rem" }}>
            {stats.map((s) => (
              <div key={s.l} style={{
                borderLeft: "1px solid rgba(201,169,110,0.22)",
                paddingLeft: "1rem",
              }}>
                <p style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.8rem, 2.6vw, 2.4rem)",
                  fontWeight: 500,
                  color: "#E8899A",
                  lineHeight: 1,
                  marginBottom: "5px",
                }}>
                  {s.n}
                </p>
                <p style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(253,250,245,0.32)",
                }}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>

          <a
            href="#booking"
            className="spread-cta"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#FDFAF5",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "14px",
              alignSelf: "flex-start",
              backgroundColor: "#B5485A",
              padding: "15px 34px",
              transition: "all 0.25s ease",
            }}
          >
            Book Your Visit
            <span className="cta-arrow" style={{ transition: "transform 0.25s ease" }}>→</span>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM — marquee + centred quote
      ══════════════════════════════════════════ */}
      <div
        ref={botRef}
        style={{
          borderTop: "1px solid rgba(253,250,245,0.07)",
          opacity: botVisible ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* Scrolling values strip */}
        <div style={{
          backgroundColor: "#130C0E",
          padding: "1.4rem 0",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "80px",
            background: "linear-gradient(to right, #130C0E, transparent)",
            zIndex: 2, pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "80px",
            background: "linear-gradient(to left, #130C0E, transparent)",
            zIndex: 2, pointerEvents: "none",
          }} />

          <div className="marquee-track">
            {[...values, ...values, ...values].map((v, i) => (
              <span key={i} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1.5rem",
                paddingRight: "1.5rem",
                whiteSpace: "nowrap",
              }}>
                <span style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  color: i % 3 === 0 ? "#C9A96E" : "rgba(253,250,245,0.3)",
                  letterSpacing: "0.04em",
                }}>
                  {v}
                </span>
                <span style={{ color: "#B5485A", fontSize: "0.5rem", opacity: 0.6 }}>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Centred founder quote */}
        <div style={{
          padding: "clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 5rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "1.5rem",
        }}>
          <div style={{
            width: "1px", height: "44px",
            background: "linear-gradient(to bottom, transparent, #C9A96E)",
          }} />
          <p style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#F5ECD7",
            lineHeight: 1.65,
            maxWidth: "600px",
            margin: 0,
          }}>
            "Every woman who walks through our doors deserves to leave
            feeling like the most radiant version of herself."
          </p>
          <div style={{
            width: "1px", height: "44px",
            background: "linear-gradient(to bottom, #C9A96E, transparent)",
          }} />
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(201,169,110,0.45)",
          }}>
            Founder, Amara Beauty Parlour
          </p>
        </div>
      </div>

      <style>{`
        /* ── Spread layout ── */
        .spread-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }

        /* ── Portrait panel ── */
        .portrait-panel {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        /* ── Story panel ── */
        .story-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(3rem, 5vw, 5.5rem) clamp(2rem, 4vw, 4.5rem);
        }

        /* ── Stats ── */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        /* ── Marquee ── */
        .marquee-track {
          display: inline-flex;
          animation: marquee 28s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }

        /* ── CTA hover ── */
        .spread-cta:hover {
          background-color: #D4788A !important;
          transform: translateY(-2px);
        }
        .spread-cta:hover .cta-arrow { transform: translateX(5px); }

        /* ── Desktop: only right fade visible ── */
        .portrait-fade-right  { display: block; }
        .portrait-fade-bottom { display: none;  }

        /* ════════════════════════════════
           TABLET  ≤ 860px — stack layout
        ════════════════════════════════ */
        @media (max-width: 860px) {
          .spread-grid {
            grid-template-columns: 1fr;
            min-height: unset;
          }
          .portrait-panel {
            min-height: 78vw !important;
            height: 78vw !important;
          }
          /* swap fades */
          .portrait-fade-right  { display: none  !important; }
          .portrait-fade-bottom { display: block !important; }
          /* pull-quote: tighter right margin on mobile */
          .pull-quote { right: 8% !important; }
          .story-panel {
            padding: 2.5rem 1.75rem !important;
          }
        }

        /* ════════════════════════════════
           MOBILE  ≤ 480px
        ════════════════════════════════ */
        @media (max-width: 480px) {
          .portrait-panel {
            min-height: 92vw !important;
            height: 92vw !important;
          }
          .pull-quote { right: 4% !important; }
          .stats-grid { gap: 1rem !important; }
          .story-panel { padding: 2rem 1.25rem !important; }
        }
      `}</style>
    </section>
  );
}