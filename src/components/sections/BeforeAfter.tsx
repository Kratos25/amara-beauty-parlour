"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";


interface TransformationItem {
  label: string;
  service: string;
  before: string;
  after: string;
  description: string;
}

function SliderCard({
  item,
  index,
}: {
  item: TransformationItem;
  index: number;
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const getPos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  // Mouse
  const onMouseDown = () => setDragging(true);
  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging) getPos(e.clientX); };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, getPos]);

  // Touch
  const onTouchStart = () => setDragging(true);
  useEffect(() => {
    const onMove = (e: TouchEvent) => { if (dragging) getPos(e.touches[0].clientX); };
    const onUp = () => setDragging(false);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onUp); };
  }, [dragging, getPos]);

  return (
    <div
      ref={cardRef}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
      }}
    >
      {/* Slider */}
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none"
        style={{ height: "420px", cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* AFTER image — full width base */}
        <div className="absolute inset-0">
          <Image src={item.after} alt="After" fill style={{ objectFit: "cover" }} />
          {/* After label */}
          <div
            className="absolute bottom-4 right-4 bg-charcoal/70 backdrop-blur-sm px-3 py-1.5"
            style={{ opacity: sliderPos < 90 ? 1 : 0, transition: "opacity 0.2s" }}
          >
            <p className="text-ivory text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
              After
            </p>
          </div>
        </div>

        {/* BEFORE image — clipped to left of slider */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="absolute inset-0" style={{ width: `${containerRef.current?.offsetWidth || 400}px` }}>
            <Image src={item.before} alt="Before" fill style={{ objectFit: "cover" }} />
          </div>
          {/* Before label */}
          <div
            className="absolute bottom-4 left-4 bg-charcoal/70 backdrop-blur-sm px-3 py-1.5"
            style={{ opacity: sliderPos > 10 ? 1 : 0, transition: "opacity 0.2s" }}
          >
            <p className="text-ivory text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Before
            </p>
          </div>
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-px bg-ivory/90 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        />

        {/* Drag handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-ivory shadow-lg flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="flex items-center gap-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#B5485A" width="8" height="12">
              <path d="M15 18l-6-6 6-6" stroke="#B5485A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#B5485A" width="8" height="12">
              <path d="M9 18l6-6-6-6" stroke="#B5485A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Drag hint — fades after interaction */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: sliderPos === 50 ? 0.7 : 0, transition: "opacity 0.4s ease" }}
        >
          <div className="bg-charcoal/60 backdrop-blur-sm px-4 py-2 flex items-center gap-2">
            <span className="text-ivory text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>
              ← Drag to reveal →
            </span>
          </div>
        </div>
      </div>

      {/* Card info */}
      <div className="bg-ivory border border-champagne px-6 py-5 flex items-center justify-between">
        <div>
          <p
            className="text-charcoal mb-1"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 500 }}
          >
            {item.label}
          </p>
          <p
            className="text-muted text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {item.description}
          </p>
        </div>
        <div className="text-right">
          <span
            className="bg-rose/10 text-rose text-[9px] tracking-[0.15em] uppercase px-3 py-1.5"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {item.service}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const [transformations, setTransformations] = useState<{label: string; service: string; before: string; after: string; description: string;}[]>([]);
  const [headVisible, setHeadVisible] = useState(false);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, COLLECTIONS.beforeAfter));
      const data = snap.docs.map(d => ({
        label:       d.data().label,
        service:     d.data().service,
        description: d.data().description,
        before:      d.data().beforeUrl,
        after:       d.data().afterUrl,
      }));
      setTransformations(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeadVisible(true); },
      { threshold: 0.3 }
    );
    if (headRef.current) observer.observe(headRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="transformations"
      className="bg-charcoal py-28 px-6 overflow-hidden"
    >
      {/* Header */}
      <div
        ref={headRef}
        className="text-center mb-16"
        style={{
          opacity: headVisible ? 1 : 0,
          transform: headVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <p
          className="text-gold text-[11px] tracking-[0.35em] uppercase mb-4"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Real Results
        </p>

        <div
          className="w-12 h-px mx-auto mb-6"
          style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }}
        />

        <h2
          className="text-ivory font-light leading-tight mb-4"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          The{" "}
          <span className="text-rose italic">Transformation</span>
          {" "}Speaks
        </h2>

        <p
          className="text-white/50 font-light max-w-md mx-auto"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.9rem",
            lineHeight: "1.85",
          }}
        >
          Drag the slider to see the magic our team creates —
          real clients, real results.
        </p>
      </div>

      {/* Grid */}
      <div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {transformations.map((item, i) => (
          <SliderCard key={item.label} item={item} index={i} />
        ))}
      </div>

      {/* Bottom note */}
      <div className="text-center mt-14">
        <a
          href="#booking"
          className="inline-block text-[11px] tracking-[0.25em] uppercase text-ivory border border-ivory/20 px-10 py-4 hover:bg-rose hover:border-rose transition-all duration-300"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Start Your Transformation
        </a>
      </div>
    </section>
  );
}