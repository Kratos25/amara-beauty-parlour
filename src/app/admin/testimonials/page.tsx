"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";

interface Testimonial {
  id: string;
  name: string;
  service: string;
  review: string;
  rating: number;
  initial: string;
  active: boolean;
  createdAt: { seconds: number };
}

const emptyForm = { name: "", service: "", review: "", rating: 5 };

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.testimonials));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Testimonial[];
      data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setTestimonials(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.service || !form.review) {
      setError("Please fill in all fields."); return;
    }
    setSaving(true); setError("");
    try {
      const payload = {
        name:    form.name.trim(),
        service: form.service.trim(),
        review:  form.review.trim(),
        rating:  form.rating,
        initial: form.name.trim().charAt(0).toUpperCase(),
        active:  true,
      };

      if (editing) {
        await updateDoc(doc(db, COLLECTIONS.testimonials, editing.id), payload);
      } else {
        await addDoc(collection(db, COLLECTIONS.testimonials), {
          ...payload, createdAt: serverTimestamp(),
        });
      }

      setForm(emptyForm);
      setEditing(null);
      setShowForm(false);
      await fetchTestimonials();
    } catch (err) { console.error(err); setError("Save failed. Try again."); }
    finally { setSaving(false); }
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, service: t.service, review: t.review, rating: t.rating });
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.testimonials, id));
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err) { console.error(err); }
  };

  const toggleActive = async (t: Testimonial) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.testimonials, t.id), { active: !t.active });
      setTestimonials(prev => prev.map(item =>
        item.id === t.id ? { ...item, active: !item.active } : item
      ));
    } catch (err) { console.error(err); }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setError("");
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#FDFAF5", fontWeight: 300 }}>
              Testimonials
            </h1>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
              {testimonials.filter(t => t.active).length} active · {testimonials.length} total
            </p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-colors duration-200"
              style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "#B5485A", color: "#FDFAF5", border: "none", cursor: "pointer" }}>
              + Add Testimonial
            </button>
          )}
        </div>

        {/* ── Form ── */}
        {showForm && (
          <div className="border border-white/8 p-6 mb-6" style={{ backgroundColor: "#1C1C1E" }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              {editing ? "Edit Testimonial" : "New Testimonial"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  Client Name *
                </label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-2.5 text-sm outline-none focus:border-rose transition-colors"
                  style={{ fontFamily: "var(--font-dm-sans)" }} />
              </div>

              {/* Service */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  Service Availed *
                </label>
                <input value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                  placeholder="e.g. Bridal Makeup"
                  className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-2.5 text-sm outline-none focus:border-rose transition-colors"
                  style={{ fontFamily: "var(--font-dm-sans)" }} />
              </div>
            </div>

            {/* Review */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Review *
              </label>
              <textarea value={form.review} onChange={e => setForm({ ...form, review: e.target.value })}
                placeholder="Write the client's testimonial here..."
                rows={4}
                className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-2.5 text-sm outline-none focus:border-rose transition-colors resize-none"
                style={{ fontFamily: "var(--font-dm-sans)" }} />
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-1.5 mb-6">
              <label style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setForm({ ...form, rating: star })}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: star <= form.rating ? "#C9A96E" : "rgba(255,255,255,0.15)", transition: "color 0.15s ease" }}>
                    ★
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-rose text-[11px] mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>⚠ {error}</p>}

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase disabled:opacity-50 transition-colors duration-200"
                style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "#B5485A", color: "#FDFAF5", border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Saving..." : editing ? "Update" : "Save Testimonial"}
              </button>
              <button onClick={handleCancel}
                className="px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-colors duration-200"
                style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Testimonials List ── */}
        {loading ? (
          <div className="p-12 text-center border border-white/8" style={{ backgroundColor: "#1C1C1E" }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)" }}>Loading...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center border border-white/8" style={{ backgroundColor: "#1C1C1E" }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)" }}>No testimonials yet. Add your first one!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {testimonials.map(t => (
              <div key={t.id}
                className="border border-white/8 p-5 transition-all duration-200"
                style={{ backgroundColor: "#1C1C1E", opacity: t.active ? 1 : 0.45 }}>
                <div className="flex items-start gap-4">

                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(181,72,90,0.15)", border: "1px solid rgba(181,72,90,0.3)", fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", color: "#B5485A" }}>
                    {t.initial}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", color: "#FDFAF5", fontWeight: 500 }}>
                        {t.name}
                      </p>
                      <span className="px-2 py-0.5 text-[8px] tracking-[0.1em] uppercase"
                        style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "rgba(201,169,110,0.15)", color: "#C9A96E" }}>
                        {t.service}
                      </span>
                      <span className="px-2 py-0.5 text-[8px] tracking-[0.1em] uppercase"
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          backgroundColor: t.active ? "rgba(16,185,129,0.15)" : "rgba(107,116,128,0.15)",
                          color: t.active ? "#10B981" : "#6B7280",
                        }}>
                        {t.active ? "Active" : "Hidden"}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < t.rating ? "#C9A96E" : "rgba(255,255,255,0.1)", fontSize: "0.75rem" }}>★</span>
                      ))}
                    </div>

                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontStyle: "italic" }}>
                      "{t.review}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(t)}
                      className="px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase border border-white/15 hover:border-gold transition-colors"
                      style={{ fontFamily: "var(--font-dm-sans)", background: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                      Edit
                    </button>
                    <button onClick={() => toggleActive(t)}
                      className="px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase border transition-colors"
                      style={{
                        fontFamily: "var(--font-dm-sans)", cursor: "pointer",
                        backgroundColor: "transparent",
                        borderColor: t.active ? "rgba(107,116,128,0.3)" : "rgba(16,185,129,0.3)",
                        color: t.active ? "#6B7280" : "#10B981",
                      }}>
                      {t.active ? "Hide" : "Show"}
                    </button>
                    <button onClick={() => handleDelete(t.id)}
                      className="px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase border border-red-400/20 hover:border-red-400/50 transition-colors"
                      style={{ fontFamily: "var(--font-dm-sans)", background: "none", color: "rgba(239,68,68,0.6)", cursor: "pointer" }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}