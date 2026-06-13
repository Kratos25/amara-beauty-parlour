"use client";

import { useEffect, useState, useRef } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, COLLECTIONS, STORAGE_PATHS } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";
import Image from "next/image";

interface BeforeAfterItem {
  id: string;
  label: string;
  service: string;
  description: string;
  beforeUrl: string;
  afterUrl: string;
  beforePath: string;
  afterPath: string;
  createdAt: { seconds: number };
}

const services = [
  "Hair Cut & Styling", "Keratin Treatment", "Hair Colouring",
  "Hydra Facial", "Cleanup & Bleach", "Bridal Makeup",
  "Party Makeup", "Nail Art", "Body Polishing",
];

export default function BeforeAfterPage() {
  const [items, setItems] = useState<BeforeAfterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ before: 0, after: 0 });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState<{ before: string | null; after: string | null }>({ before: null, after: null });
  const [files, setFiles] = useState<{ before: File | null; after: File | null }>({ before: null, after: null });
  const [form, setForm] = useState({ label: "", service: services[0], description: "" });
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.beforeAfter));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as BeforeAfterItem[];
      data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setItems(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFileSelect = (side: "before" | "after") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setError(`${side} image must be under 5MB.`); return; }
    setFiles(prev => ({ ...prev, [side]: f }));
    setError("");
    const reader = new FileReader();
    reader.onload = () => setPreview(prev => ({ ...prev, [side]: reader.result as string }));
    reader.readAsDataURL(f);
  };

  const uploadFile = async (file: File, path: string, side: "before" | "after") => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    return new Promise<string>((resolve, reject) => {
      task.on("state_changed",
        snap => setProgress(prev => ({ ...prev, [side]: Math.round((snap.bytesTransferred / snap.totalBytes) * 100) })),
        reject,
        async () => { resolve(await getDownloadURL(storageRef)); }
      );
    });
  };

  const handleUpload = async () => {
    if (!files.before || !files.after) { setError("Please select both before and after images."); return; }
    if (!form.label) { setError("Please enter a transformation label."); return; }
    setUploading(true); setError("");
    try {
      const ts = Date.now();
      const beforePath = `${STORAGE_PATHS.beforeImages}/${ts}-before.jpg`;
      const afterPath  = `${STORAGE_PATHS.afterImages}/${ts}-after.jpg`;
      const [beforeUrl, afterUrl] = await Promise.all([
        uploadFile(files.before, beforePath, "before"),
        uploadFile(files.after,  afterPath,  "after"),
      ]);
      await addDoc(collection(db, COLLECTIONS.beforeAfter), {
        label:       form.label.trim(),
        service:     form.service,
        description: form.description.trim(),
        beforeUrl, afterUrl, beforePath, afterPath,
        createdAt:   serverTimestamp(),
      });
      setFiles({ before: null, after: null });
      setPreview({ before: null, after: null });
      setForm({ label: "", service: services[0], description: "" });
      setProgress({ before: 0, after: 0 });
      setShowForm(false);
      if (beforeRef.current) beforeRef.current.value = "";
      if (afterRef.current)  afterRef.current.value  = "";
      await fetchItems();
    } catch (err) { console.error(err); setError("Upload failed. Please try again."); }
    finally { setUploading(false); }
  };

  const handleDelete = async (item: BeforeAfterItem) => {
    if (!confirm("Delete this before & after pair?")) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.beforeAfter, item.id));
      try {
        await Promise.all([
          deleteObject(ref(storage, item.beforePath)),
          deleteObject(ref(storage, item.afterPath)),
        ]);
      } catch { /* ignore missing files */ }
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) { console.error(err); }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#FDFAF5", fontWeight: 300 }}>
              Before & After
            </h1>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
              {items.length} transformations uploaded
            </p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "#B5485A", color: "#FDFAF5", border: "none", cursor: "pointer" }}>
              + Add Transformation
            </button>
          )}
        </div>

        {/* ── Upload Form ── */}
        {showForm && (
          <div className="border border-white/8 p-6 mb-8" style={{ backgroundColor: "#1C1C1E" }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              New Transformation
            </p>

            {/* Before & After image pickers */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {(["before", "after"] as const).map(side => (
                <div key={side}>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: side === "before" ? "#6B7280" : "#10B981", marginBottom: "8px" }}>
                    {side} image *
                  </p>
                  <div
                    onClick={() => (side === "before" ? beforeRef : afterRef).current?.click()}
                    className="border border-dashed cursor-pointer flex items-center justify-center overflow-hidden hover:border-rose transition-colors"
                    style={{ borderColor: preview[side] ? (side === "before" ? "#6B7280" : "#10B981") : "rgba(255,255,255,0.1)", height: preview[side] ? "auto" : "160px", aspectRatio: preview[side] ? "1/1" : "auto", position: "relative" }}
                  >
                    {preview[side] ? (
                      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
                        <Image src={preview[side]!} alt={side} fill style={{ objectFit: "cover" }} />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "#FDFAF5", letterSpacing: "0.15em", textTransform: "uppercase" }}>Change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <p style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.1)", marginBottom: "6px" }}>+</p>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
                          Select {side} image
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  {uploading && progress[side] > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>Uploading {side}...</p>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", color: "#C9A96E" }}>{progress[side]}%</p>
                      </div>
                      <div className="w-full h-0.5 bg-white/10">
                        <div className="h-full bg-gold transition-all" style={{ width: `${progress[side]}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <input ref={beforeRef} type="file" accept="image/*" onChange={handleFileSelect("before")} className="hidden" />
            <input ref={afterRef}  type="file" accept="image/*" onChange={handleFileSelect("after")}  className="hidden" />

            {/* Label + Service + Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  Transformation Label *
                </label>
                <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. Hair Transformation"
                  className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-2.5 text-sm outline-none focus:border-rose transition-colors"
                  style={{ fontFamily: "var(--font-dm-sans)" }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  Service
                </label>
                <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                  className="border border-white/15 text-ivory px-4 py-2.5 text-sm outline-none focus:border-rose transition-colors cursor-pointer"
                  style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "#111111" }}>
                  {services.map(s => (
                    <option key={s} value={s} style={{ backgroundColor: "#1C1C1E" }}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mb-5">
              <label style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Short Description
              </label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Frizzy to silky smooth"
                className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-2.5 text-sm outline-none focus:border-rose transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)" }} />
            </div>

            {error && <p className="text-rose text-[11px] mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>⚠ {error}</p>}

            <div className="flex gap-3">
              <button onClick={handleUpload} disabled={uploading}
                className="px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase disabled:opacity-50 transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "#B5485A", color: "#FDFAF5", border: "none", cursor: uploading ? "not-allowed" : "pointer" }}>
                {uploading ? "Uploading..." : "Upload Pair"}
              </button>
              <button onClick={() => { setShowForm(false); setFiles({ before: null, after: null }); setPreview({ before: null, after: null }); setError(""); }}
                className="px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Items Grid ── */}
        {loading ? (
          <div className="p-12 text-center border border-white/8" style={{ backgroundColor: "#1C1C1E" }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)" }}>Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center border border-white/8" style={{ backgroundColor: "#1C1C1E" }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)" }}>
              No transformations yet. Upload your first pair!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {items.map(item => (
              <div key={item.id} className="border border-white/8 overflow-hidden" style={{ backgroundColor: "#1C1C1E" }}>

                {/* Image pair */}
                <div className="grid grid-cols-2">
                  {[{ url: item.beforeUrl, side: "Before", color: "#6B7280" }, { url: item.afterUrl, side: "After", color: "#10B981" }].map(img => (
                    <div key={img.side} className="relative" style={{ aspectRatio: "3/4" }}>
                      <Image src={img.url} alt={img.side} fill style={{ objectFit: "cover" }} />
                      <div className="absolute top-2 left-2 px-2 py-0.5"
                        style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", color: img.color }}>
                          {img.side}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.15rem", color: "#FDFAF5", fontWeight: 500, lineHeight: 1.2 }}>
                        {item.label}
                      </p>
                      {item.description && (
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <button onClick={() => handleDelete(item)}
                      className="flex-shrink-0 px-3 py-1 text-[9px] tracking-[0.1em] uppercase border border-red-400/20 hover:border-red-400/50 transition-colors"
                      style={{ fontFamily: "var(--font-dm-sans)", background: "none", color: "rgba(239,68,68,0.6)", cursor: "pointer" }}>
                      Delete
                    </button>
                  </div>
                  <span className="px-2 py-0.5 text-[8px] tracking-[0.1em] uppercase"
                    style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "rgba(201,169,110,0.15)", color: "#C9A96E" }}>
                    {item.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}