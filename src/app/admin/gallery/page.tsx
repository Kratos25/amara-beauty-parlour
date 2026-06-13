"use client";

import { useEffect, useState, useRef } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, COLLECTIONS, STORAGE_PATHS } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";
import Image from "next/image";

const categories = ["Hair", "Skin", "Nails", "Bridal", "Makeup", "Wellness"];

interface GalleryItem {
  id: string;
  url: string;
  category: string;
  caption: string;
  storagePath: string;
  createdAt: { seconds: number };
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filtered, setFiltered] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [category, setCategory] = useState("Hair");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchGallery(); }, []);

  useEffect(() => {
    if (activeCategory === "All") setFiltered(items);
    else setFiltered(items.filter(i => i.category === activeCategory));
  }, [activeCategory, items]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.gallery));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as GalleryItem[];
      data.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setItems(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setError("File must be under 5MB."); return; }
    setFile(f);
    setError("");
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleUpload = async () => {
    if (!file) { setError("Please select an image."); return; }
    setUploading(true);
    setError("");
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${STORAGE_PATHS.gallery}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on("state_changed",
          (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          resolve
        );
      });

      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, COLLECTIONS.gallery), {
        url,
        category,
        caption: caption.trim(),
        storagePath: `${STORAGE_PATHS.gallery}/${fileName}`,
        createdAt: serverTimestamp(),
      });

      setFile(null);
      setPreview(null);
      setCaption("");
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
      await fetchGallery();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.gallery, item.id));
      try {
        await deleteObject(ref(storage, item.storagePath));
      } catch { /* storage file may not exist */ }
      setItems(prev => prev.filter(i => i.id !== item.id));
      if (lightbox?.id === item.id) setLightbox(null);
    } catch (err) { console.error(err); }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#FDFAF5", fontWeight: 300 }}>
            Gallery Manager
          </h1>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
            {items.length} images uploaded
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Upload Panel ── */}
          <div className="border border-white/8 p-6" style={{ backgroundColor: "#1C1C1E" }}>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              Upload New Image
            </p>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border border-dashed border-white/15 flex flex-col items-center justify-center cursor-pointer hover:border-rose transition-colors duration-200 mb-4"
              style={{ height: preview ? "auto" : "160px", padding: preview ? "0" : "2rem", overflow: "hidden" }}
            >
              {preview ? (
                <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                  <Image src={preview} alt="Preview" fill style={{ objectFit: "cover" }} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "#FDFAF5", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                      Change Image
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: "2rem", color: "rgba(255,255,255,0.15)", marginBottom: "8px" }}>+</p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
                    Click to select image<br />
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Max 5MB · JPG, PNG, WEBP</span>
                  </p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {/* Category */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Category
              </label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="bg-transparent border border-white/15 text-ivory px-4 py-2.5 text-sm outline-none focus:border-gold transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "#111111" }}>
                {categories.map(c => (
                  <option key={c} value={c} style={{ backgroundColor: "#1C1C1E" }}>{c}</option>
                ))}
              </select>
            </div>

            {/* Caption */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                Caption (optional)
              </label>
              <input value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="e.g. Bridal look for Priya's wedding"
                className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-2.5 text-sm outline-none focus:border-gold transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)" }} />
            </div>

            {/* Progress */}
            {uploading && (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Uploading...</p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "#C9A96E" }}>{progress}%</p>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-rose transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {error && (
              <p className="text-rose text-[11px] mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>⚠ {error}</p>
            )}

            <button onClick={handleUpload} disabled={uploading || !file}
              className="w-full py-3 text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 disabled:opacity-40"
              style={{
                fontFamily: "var(--font-dm-sans)",
                backgroundColor: uploading || !file ? "rgba(181,72,90,0.3)" : "#B5485A",
                color: "#FDFAF5", border: "none", cursor: uploading || !file ? "not-allowed" : "pointer",
              }}>
              {uploading ? `Uploading ${progress}%` : "Upload Image"}
            </button>
          </div>

          {/* ── Gallery Grid ── */}
          <div className="lg:col-span-2">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["All", ...categories].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    backgroundColor: activeCategory === cat ? "#B5485A" : "transparent",
                    color: activeCategory === cat ? "#FDFAF5" : "rgba(255,255,255,0.35)",
                    border: `1px solid ${activeCategory === cat ? "#B5485A" : "rgba(255,255,255,0.1)"}`,
                    cursor: "pointer",
                  }}>
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48 border border-white/8" style={{ backgroundColor: "#1C1C1E" }}>
                <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)" }}>Loading...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 border border-white/8" style={{ backgroundColor: "#1C1C1E" }}>
                <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
                  No images yet. Upload your first one!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filtered.map(item => (
                  <div key={item.id} className="relative group overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    <Image src={item.url} alt={item.caption || item.category}
                      fill style={{ objectFit: "cover" }} />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
                      <button onClick={() => setLightbox(item)}
                        className="px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase border border-white/40 text-ivory hover:bg-white/10 transition-colors"
                        style={{ fontFamily: "var(--font-dm-sans)", background: "rgba(255,255,255,0.1)", cursor: "pointer" }}>
                        View
                      </button>
                      <button onClick={() => handleDelete(item)}
                        className="px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-colors"
                        style={{ fontFamily: "var(--font-dm-sans)", background: "transparent", cursor: "pointer" }}>
                        Delete
                      </button>
                    </div>

                    {/* Category tag */}
                    <div className="absolute top-2 left-2 px-2 py-0.5"
                      style={{ backgroundColor: "rgba(28,28,30,0.75)", backdropFilter: "blur(4px)" }}>
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A96E" }}>
                        {item.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
            onClick={() => setLightbox(null)}>
            <div className="relative max-w-2xl w-full" style={{ aspectRatio: "3/4" }}
              onClick={e => e.stopPropagation()}>
              <Image src={lightbox.url} alt={lightbox.caption || lightbox.category}
                fill style={{ objectFit: "contain" }} />
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              {lightbox.caption && (
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
                  {lightbox.caption}
                </p>
              )}
              <span className="px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase mt-2 inline-block"
                style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "rgba(201,169,110,0.2)", color: "#C9A96E" }}>
                {lightbox.category}
              </span>
            </div>
            <button onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-rose hover:border-rose transition-all"
              style={{ background: "transparent", color: "#FDFAF5", cursor: "pointer", fontSize: "1rem" }}>
              ✕
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}