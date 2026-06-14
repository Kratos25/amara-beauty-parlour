"use client";

import { useState } from "react";

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);

  const phone = "919922566151"; // Replace with your real number
  const waMessage = "Hi Amara Beauty Parlour! I'd like to book an appointment.";
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
  const callUrl = `tel:+${phone}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Expanded buttons ── */}
      {/* WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-3 group"
        style={{
          textDecoration: "none",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
          transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Tooltip */}
        <div
          className="bg-charcoal text-ivory text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          WhatsApp
        </div>
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.84L.057 23.428a.75.75 0 00.916.916l5.588-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.693 9.693 0 01-4.946-1.355l-.355-.21-3.664.961.977-3.567-.23-.368A9.693 9.693 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
          </svg>
        </div>
      </a>

      {/* Call */}
      <a
        href={callUrl}
        aria-label="Call us"
        className="flex items-center gap-3 group"
        style={{
          textDecoration: "none",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
          transition: "opacity 0.2s ease 0.05s, transform 0.2s ease 0.05s",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Tooltip */}
        <div
          className="bg-charcoal text-ivory text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Call Now
        </div>
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: "#1C1C1E" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd"/>
          </svg>
        </div>
      </a>

      {/* ── Main FAB toggle button ── */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open contact menu"}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-none cursor-pointer"
        style={{
          backgroundColor: open ? "#6B6460" : "#B5485A",
          transition: "background-color 0.3s ease, transform 0.3s ease",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        {/* Chevron up icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="22"
          height="22"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* Pulse ring on FAB when closed */}
      {!open && (
        <div
          className="absolute bottom-0 right-0 w-14 h-14 rounded-full -z-10"
          style={{
            backgroundColor: "#B5485A",
            opacity: 0.3,
            animation: "fabPulse 2s ease-out infinite",
          }}
        />
      )}

      <style>{`
        @keyframes fabPulse {
          0%   { transform: scale(1);   opacity: 0.3; }
          70%  { transform: scale(1.7); opacity: 0; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>
    </div>
  );
}