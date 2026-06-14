"use client";

const quickLinks = [
  { label: "Home",         href: "#home" },
  { label: "Services",     href: "#services" },
  { label: "About Us",     href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Book Now",     href: "#booking" },
];

const services = [
  "Hair Care & Styling",
  "Skin & Facials",
  "Nail Studio",
  "Bridal & Makeup",
  "Waxing & Threading",
  "Wellness & Spa",
];

const socials = [
  { label: "Instagram", href: "#", icon: "IG" },
  { label: "Facebook",  href: "#", icon: "FB" },
  { label: "WhatsApp",  href: "#", icon: "WA" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" style={{ backgroundColor: "#111111", color: "#FDFAF5" }}>

      {/* ── CTA Banner ── */}
      <div style={{
        backgroundColor: "#B5485A",
        padding: "4rem 1.5rem",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "11px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(253,250,245,0.7)",
          marginBottom: "1rem",
        }}>
          Ready to Glow?
        </p>
        <h2 style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(2.2rem, 5vw, 4rem)",
          fontWeight: 300,
          color: "#FDFAF5",
          lineHeight: 1.1,
          marginBottom: "2rem",
        }}>
          Book Your Appointment{" "}
          <span style={{ fontStyle: "italic", opacity: 0.85 }}>Today</span>
        </h2>
        <a
          href="tel:+919922566151"
          className="footer-cta-btn"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            backgroundColor: "#FDFAF5",
            color: "#B5485A",
            padding: "16px 48px",
            textDecoration: "none",
            display: "inline-block",
            transition: "all 0.25s ease",
          }}
        >
          Call Us Now
        </a>
      </div>

      {/* ── Main Footer Grid ── */}
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "5rem 1.5rem 3rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "3rem",
      }}>

        {/* Brand column */}
        <div style={{ gridColumn: "span 1" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2.2rem",
              color: "#FDFAF5",
              fontWeight: 500,
              letterSpacing: "0.03em",
              lineHeight: 1,
              marginBottom: "4px",
            }}>
              Amara
            </p>
            <p style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "9px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#C9A96E",
            }}>
              Beauty Parlour
            </p>
          </div>

          <div style={{
            width: "40px", height: "1px", marginBottom: "1.5rem",
            background: "linear-gradient(90deg, #C9A96E, transparent)",
          }} />

          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.85rem",
            color: "rgba(253,250,245,0.5)",
            lineHeight: 1.85,
            fontWeight: 300,
            marginBottom: "2rem",
          }}>
            Where every visit is a moment of
            luxury, care, and transformation.
          </p>

          {/* Socials */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="social-btn"
                style={{
                  width: "38px",
                  height: "38px",
                  border: "1px solid rgba(253,250,245,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                  color: "rgba(253,250,245,0.5)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#C9A96E",
            marginBottom: "1.5rem",
          }}>
            Quick Links
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="footer-link"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.85rem",
                    color: "rgba(253,250,245,0.5)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "color 0.2s ease",
                  }}
                >
                  <span style={{ color: "#B5485A", fontSize: "8px" }}>◆</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#C9A96E",
            marginBottom: "1.5rem",
          }}>
            Our Services
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {services.map((s) => (
              <li key={s}>
                <a
                  href="#services"
                  className="footer-link"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.85rem",
                    color: "rgba(253,250,245,0.5)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "color 0.2s ease",
                  }}
                >
                  <span style={{ color: "#B5485A", fontSize: "8px" }}>◆</span>
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#C9A96E",
            marginBottom: "1.5rem",
          }}>
            Find Us
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Address */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ color: "#B5485A", fontSize: "0.75rem", marginTop: "2px" }}>◆</span>
              <p style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.85rem",
                color: "rgba(253,250,245,0.5)",
                lineHeight: 1.7,
                fontWeight: 300,
              }}>
                Amara Beauty Parlour, Near Kill Bill School,<br />
                Thergaon, Pune, — 411033
              </p>
            </div>

            {/* Phone */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <span style={{ color: "#B5485A", fontSize: "0.75rem" }}>◆</span>
              <a
                href="tel:+919922566151"
                className="footer-link"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.85rem",
                  color: "rgba(253,250,245,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                +91 99225 66151
              </a>
            </div>

            {/* Email */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <span style={{ color: "#B5485A", fontSize: "0.75rem" }}>◆</span>
              <a
                href="mailto:hello@amarabeautyparlour.com"
                className="footer-link"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.85rem",
                  color: "rgba(253,250,245,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                hello@amarabeautyparlour.com
              </a>
            </div>

            {/* Hours */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ color: "#B5485A", fontSize: "0.75rem", marginTop: "2px" }}>◆</span>
              <div>
                <p style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.85rem",
                  color: "rgba(253,250,245,0.5)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}>
                  Mon – Sat: 9:00 AM – 8:00 PM<br />
                  Sunday: 10:00 AM – 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{
        borderTop: "1px solid rgba(253,250,245,0.07)",
        padding: "1.5rem",
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "11px",
          color: "rgba(253,250,245,0.25)",
          letterSpacing: "0.05em",
        }}>
          © {year} Amara Beauty Parlour. All rights reserved.
        </p>
        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "11px",
          color: "rgba(253,250,245,0.25)",
          letterSpacing: "0.05em",
        }}>
          Made with <span style={{ color: "#B5485A" }}>♥</span> for Amara
        </p>
      </div>

      <style>{`
        .footer-link:hover { color: #FDFAF5 !important; }
        .social-btn:hover {
          background-color: #B5485A !important;
          border-color: #B5485A !important;
          color: #FDFAF5 !important;
        }
        .footer-cta-btn:hover {
          background-color: #1C1C1E !important;
          color: #FDFAF5 !important;
        }
      `}</style>
    </footer>
  );
}