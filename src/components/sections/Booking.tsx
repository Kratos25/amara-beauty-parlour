"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import emailjs from "@emailjs/browser";

const services = [
  "Hair Cut & Styling",
  "Keratin Treatment",
  "Hair Colouring",
  "Hydra Facial",
  "Cleanup & Bleach",
  "Gel Manicure",
  "Nail Art & Extensions",
  "Bridal Makeup",
  "Party Makeup",
  "Waxing & Threading",
  "Body Polishing",
  "Head Massage",
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM", "6:00 PM",
];

export default function Booking() {
 const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    customService: "",
    date: "",
    time: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.service || !formData.date) {
      setError("Please fill in all required fields.");
      return;
    }
    if (formData.phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const finalService = formData.service === "Other (specify below)"
        ? `Other: ${formData.customService}`
        : formData.service;

      // 1. Save booking to Firestore
      await addDoc(collection(db, COLLECTIONS.bookings), {
        name:      formData.name.trim(),
        phone:     formData.phone.trim(),
        email:     formData.email.trim(),
        service:   finalService,
        date:      formData.date,
        time:      formData.time,
        message:   formData.message.trim(),
        status:    "pending",
        createdAt: serverTimestamp(),
      });

      // 2. Upsert customer profile
      const customerRef = doc(db, COLLECTIONS.customers, formData.phone.trim());
      const customerSnap = await getDoc(customerRef);
      if (customerSnap.exists()) {
        await setDoc(customerRef, {
          name:          formData.name.trim(),
          phone:         formData.phone.trim(),
          email:         formData.email.trim(),
          totalBookings: increment(1),
          lastBooking:   serverTimestamp(),
          lastService:   finalService,
        }, { merge: true });
      } else {
        await setDoc(customerRef, {
          name:          formData.name.trim(),
          phone:         formData.phone.trim(),
          email:         formData.email.trim(),
          totalBookings: 1,
          firstBooking:  serverTimestamp(),
          lastBooking:   serverTimestamp(),
          lastService:   finalService,
        });
      }

      // 3. Send email notification via EmailJS
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          {
            client_name: formData.name.trim(),
            client_phone: formData.phone.trim(),
            client_email: formData.email.trim() || "Not provided",
            service:      finalService,
            date:         formData.date,
            time:         formData.time || "Not specified",
            message:      formData.message.trim() || "No message",
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        );
      } catch (emailErr) {
        // Email failed but booking is saved — don't block user
        console.error("Email notification failed:", emailErr);
      }

      // 4. Open WhatsApp with booking details
      const waPhone = "919999999999"; // Replace with your real number
      const waMessage =
        `🌸 *New Booking — Amara Beauty Parlour*\n\n` +
        `*Name:* ${formData.name.trim()}\n` +
        `*Phone:* ${formData.phone.trim()}\n` +
        `*Email:* ${formData.email.trim() || "Not provided"}\n` +
        `*Service:* ${finalService}\n` +
        `*Date:* ${formData.date}\n` +
        `*Time:* ${formData.time || "Not specified"}\n` +
        `*Message:* ${formData.message.trim() || "None"}\n\n` +
        `📋 View in admin: https://amarabeauty.com/admin/bookings`;

      window.open(
        `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`,
        "_blank"
      );

      setSubmitted(true);
    } catch (err) {
      console.error("Booking error:", err);
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="bg-charcoal py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* ── Left: Info ── */}
        <div>
          <p className="text-gold text-[11px] tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "var(--font-dm-sans)" }}>
            Reservations
          </p>

          <div className="w-12 h-px mb-6"
            style={{ background: "linear-gradient(90deg, #C9A96E, transparent)" }} />

          <h2 className="text-ivory font-light leading-tight mb-6"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Book Your{" "}
            <span className="text-rose italic">Session</span>
          </h2>

          <p className="text-white/50 leading-relaxed mb-12 font-light"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.95rem", lineHeight: "1.9" }}>
            Reserve your spot at Amara and let us take care of the rest.
            We'll confirm your appointment within 24 hours.
          </p>

          {/* Contact options */}
          <div className="flex flex-col gap-6">
            {[
              { icon: "◆", label: "Phone",     value: "+91 99999 99999",      href: "tel:+919999999999" },
              { icon: "◆", label: "WhatsApp",  value: "Chat with us",         href: "#" },
              { icon: "◆", label: "Email",     value: "hello@amarabeauty.com", href: "mailto:hello@amarabeauty.com" },
            ].map((item) => (
              <a key={item.label} href={item.href}
                className="flex items-center gap-4 group"
                style={{ textDecoration: "none" }}>
                <span className="text-rose text-xs">{item.icon}</span>
                <div>
                  <p className="text-white/30 mb-0.5"
                    style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {item.label}
                  </p>
                  <p className="text-ivory/70 group-hover:text-ivory transition-colors duration-200"
                    style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem" }}>
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Hours */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-gold mb-4"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
              Opening Hours
            </p>
            <p className="text-white/50 font-light"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", lineHeight: "1.9" }}>
              Monday – Saturday: 9:00 AM – 8:00 PM<br />
              Sunday: 10:00 AM – 6:00 PM
            </p>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="bg-ivory/5 border border-white/8 p-10">
          {submitted ? (
            // ── Success State ──
            <div className="flex flex-col items-center justify-center text-center py-16 gap-6">
              <div className="w-16 h-16 rounded-full bg-rose flex items-center justify-center text-ivory text-2xl">
                ✓
              </div>
              <h3 className="text-ivory font-light"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem" }}>
                Booking Received!
              </h3>
              <p className="text-white/50 font-light"
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", lineHeight: "1.8" }}>
                Thank you, <span className="text-ivory">{formData.name}</span>.
                We'll confirm your appointment shortly.
              </p>
              <div className="bg-white/5 border border-white/10 px-6 py-4 text-left w-full mt-2">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Service", value: formData.service },
                    { label: "Date",    value: formData.date },
                    { label: "Time",    value: formData.time || "To be confirmed" },
                    { label: "Phone",   value: formData.phone },
                  ].map((r) => (
                    <div key={r.label}>
                      <p className="text-white/30 text-[9px] tracking-[0.2em] uppercase mb-1"
                        style={{ fontFamily: "var(--font-dm-sans)" }}>{r.label}</p>
                      <p className="text-ivory/80 text-sm"
                        style={{ fontFamily: "var(--font-dm-sans)" }}>{r.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: "", phone: "", email: "", service: "",customService: "", date: "", time: "", message: "" }); }}
                className="text-gold border-b border-gold/40 pb-1 text-[11px] tracking-[0.2em] uppercase mt-2 hover:text-ivory hover:border-ivory/40 transition-colors duration-200"
                style={{ fontFamily: "var(--font-dm-sans)", background: "none", cursor: "pointer", border: "none", borderBottom: "1px solid" }}
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            // ── Form ──
            <div className="flex flex-col gap-5">
              <p className="text-gold text-[10px] tracking-[0.25em] uppercase mb-2"
                style={{ fontFamily: "var(--font-dm-sans)" }}>
                Fill in your details
              </p>

              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[9px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-dm-sans)" }}>Full Name *</label>
                  <input name="name" value={formData.name} onChange={handleChange}
                    placeholder="Your name"
                    className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-3 text-sm outline-none focus:border-rose transition-colors duration-200"
                    style={{ fontFamily: "var(--font-dm-sans)" }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[9px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-dm-sans)" }}>Phone *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-3 text-sm outline-none focus:border-rose transition-colors duration-200"
                    style={{ fontFamily: "var(--font-dm-sans)" }} />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-[9px] tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-dm-sans)" }}>Email</label>
                <input name="email" value={formData.email} onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-3 text-sm outline-none focus:border-rose transition-colors duration-200"
                  style={{ fontFamily: "var(--font-dm-sans)" }} />
              </div>

              {/* Service */}
              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-[9px] tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-dm-sans)" }}>Service *</label>
                <select name="service" value={formData.service} onChange={handleChange}
                  className="bg-charcoal border border-white/15 text-ivory px-4 py-3 text-sm outline-none focus:border-rose transition-colors duration-200 cursor-pointer"
                  style={{ fontFamily: "var(--font-dm-sans)" }}>
                  <option value="" disabled>Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s} style={{ backgroundColor: "#1C1C1E" }}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[9px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-dm-sans)" }}>Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange}
                    className="bg-transparent border border-white/15 text-ivory/70 px-4 py-3 text-sm outline-none focus:border-rose transition-colors duration-200"
                    style={{ fontFamily: "var(--font-dm-sans)", colorScheme: "dark" }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 text-[9px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-dm-sans)" }}>Time</label>
                  <select name="time" value={formData.time} onChange={handleChange}
                    className="bg-charcoal border border-white/15 text-ivory px-4 py-3 text-sm outline-none focus:border-rose transition-colors duration-200 cursor-pointer"
                    style={{ fontFamily: "var(--font-dm-sans)" }}>
                    <option value="" disabled>Select time</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t} style={{ backgroundColor: "#1C1C1E" }}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-[9px] tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-dm-sans)" }}>Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange}
                  placeholder="Any special requests or notes..."
                  rows={3}
                  className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-3 text-sm outline-none focus:border-rose transition-colors duration-200 resize-none"
                  style={{ fontFamily: "var(--font-dm-sans)" }} />
              </div>

              {/* Error */}
              {error && (
                <p className="text-rose text-[11px] tracking-wide"
                  style={{ fontFamily: "var(--font-dm-sans)" }}>
                  ⚠ {error}
                </p>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-rose text-ivory py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-rose-light transition-colors duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-dm-sans)", cursor: "pointer", border: "none" }}
              >
                {loading ? "Submitting..." : "Confirm Booking"}
              </button>

              <p className="text-white/25 text-center text-[10px] tracking-wider"
                style={{ fontFamily: "var(--font-dm-sans)" }}>
                * Required fields. We'll confirm within 24 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}