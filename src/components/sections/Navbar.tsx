"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home",         href: "#home" },
  { label: "Services",     href: "#services" },
  { label: "Gallery",      href: "#gallery" },
  { label: "About",        href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact",      href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
      style={{
        backgroundColor: scrolled ? "rgba(253,250,245,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      {/* ── Top Bar ── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "80px",
        }}
      >
        {/* Logo */}
        <a href="#home" style={{ textDecoration: "none" }}>
          <div style={{ lineHeight: 1 }}>
            <div style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2rem",
              color: "#B5485A",
              fontWeight: 500,
              letterSpacing: "0.03em",
            }}>
              Amara
            </div>
            <div style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "9px",
              color: "#6B6460",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginTop: "3px",
            }}>
              Beauty Parlour
            </div>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex" style={{ gap: "2.5rem" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#1C1C1E",
                textDecoration: "none",
                position: "relative",
                paddingBottom: "4px",
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#booking"
          className="hidden md:block book-btn"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            backgroundColor: "#B5485A",
            color: "#FDFAF5",
            padding: "12px 28px",
            textDecoration: "none",
            transition: "background-color 0.2s ease",
          }}
        >
          Book Now
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
          aria-label="Toggle menu"
        >
          <span style={{
            display: "block", width: "24px", height: "1.5px",
            backgroundColor: "#1C1C1E", transition: "all 0.3s ease",
            transform: menuOpen ? "rotate(45deg) translate(4.5px, 4.5px)" : "none",
          }} />
          <span style={{
            display: "block", width: "24px", height: "1.5px",
            backgroundColor: "#1C1C1E", transition: "all 0.3s ease",
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: "block", width: "24px", height: "1.5px",
            backgroundColor: "#1C1C1E", transition: "all 0.3s ease",
            transform: menuOpen ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none",
          }} />
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: menuOpen ? "500px" : "0",
          opacity: menuOpen ? 1 : 0,
          transition: "max-height 0.35s ease, opacity 0.25s ease",
          backgroundColor: "rgba(253,250,245,0.98)",
          borderTop: menuOpen ? "1px solid #F5ECD7" : "none",
        }}
        className="md:hidden"
      >
        <div style={{ padding: "2rem 2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "13px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#1C1C1E",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Gold divider */}
          <div style={{
            width: "60px", height: "1px",
            background: "linear-gradient(90deg, transparent, #C9A96E, transparent)",
          }} />

          <a
            href="#booking"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              backgroundColor: "#B5485A",
              color: "#FDFAF5",
              padding: "16px",
              textAlign: "center",
              textDecoration: "none",
              display: "block",
            }}
          >
            Book Now
          </a>
        </div>
      </div>

      <style>{`
        .nav-link:hover { color: #B5485A !important; }
        .book-btn:hover { background-color: #D4788A !important; }
      `}</style>
    </header>
  );
}