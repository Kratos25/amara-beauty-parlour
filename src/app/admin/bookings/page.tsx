"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  message: string;
  status: string;
  createdAt: { seconds: number };
}

const statusOptions = ["pending", "confirmed", "completed", "cancelled"];
const statusColor: Record<string, string> = {
  pending:   "#F59E0B",
  confirmed: "#10B981",
  completed: "#6B7280",
  cancelled: "#EF4444",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let list = [...bookings];
    if (statusFilter !== "all") list = list.filter(b => b.status === statusFilter);
    if (search) list = list.filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.service.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [search, statusFilter, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, COLLECTIONS.bookings), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[];
      setBookings(data);
      setFiltered(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, COLLECTIONS.bookings, id), { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    } catch (err) { console.error(err); }
    finally { setUpdating(""); }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.bookings, id));
      setBookings(prev => prev.filter(b => b.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) { console.error(err); }
  };

  const formatDate = (seconds: number) =>
    new Date(seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#FDFAF5", fontWeight: 300 }}>
              Bookings
            </h1>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
              {filtered.length} of {bookings.length} bookings
            </p>
          </div>
          <button onClick={fetchBookings}
            className="text-[10px] tracking-[0.2em] uppercase px-4 py-2 border border-white/15 hover:border-gold transition-colors duration-200"
            style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.4)", background: "none", cursor: "pointer" }}>
            ↻ Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, service..."
            className="flex-1 min-w-48 bg-transparent border border-white/15 text-ivory placeholder:text-white/25 px-4 py-2.5 text-sm outline-none focus:border-gold transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
          {/* Status filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", ...statusOptions].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase transition-all duration-200"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  backgroundColor: statusFilter === s ? (s === "all" ? "#B5485A" : statusColor[s]) : "transparent",
                  color: statusFilter === s ? "#FDFAF5" : "rgba(255,255,255,0.35)",
                  border: `1px solid ${statusFilter === s ? (s === "all" ? "#B5485A" : statusColor[s]) : "rgba(255,255,255,0.1)"}`,
                  cursor: "pointer",
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Table */}
          <div className="flex-1 border border-white/8 overflow-hidden" style={{ backgroundColor: "#1C1C1E" }}>
            {loading ? (
              <div className="p-12 text-center">
                <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)" }}>Loading bookings...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)" }}>No bookings found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/8">
                      {["Client", "Service", "Date & Time", "Booked On", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left px-5 py-3"
                          style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(b => (
                      <tr key={b.id}
                        onClick={() => setSelected(b)}
                        className="border-b border-white/4 cursor-pointer transition-colors duration-150"
                        style={{ backgroundColor: selected?.id === b.id ? "rgba(181,72,90,0.08)" : "transparent" }}>
                        <td className="px-5 py-4">
                          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.875rem", color: "#FDFAF5" }}>{b.name}</p>
                          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{b.phone}</p>
                        </td>
                        <td className="px-5 py-4" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", maxWidth: "160px" }}>
                          {b.service}
                        </td>
                        <td className="px-5 py-4">
                          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{b.date}</p>
                          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{b.time || "—"}</p>
                        </td>
                        <td className="px-5 py-4" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                          {b.createdAt ? formatDate(b.createdAt.seconds) : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={b.status}
                            onChange={e => { e.stopPropagation(); updateStatus(b.id, e.target.value); }}
                            onClick={e => e.stopPropagation()}
                            disabled={updating === b.id}
                            className="text-[10px] tracking-[0.1em] uppercase px-2 py-1 outline-none cursor-pointer"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              backgroundColor: `${statusColor[b.status]}20`,
                              color: statusColor[b.status],
                              border: `1px solid ${statusColor[b.status]}40`,
                            }}>
                            {statusOptions.map(s => (
                              <option key={s} value={s} style={{ backgroundColor: "#1C1C1E", color: "#FDFAF5" }}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={e => { e.stopPropagation(); deleteBooking(b.id); }}
                            className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
                            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-dm-sans)" }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="w-72 border border-white/8 p-6 flex-shrink-0" style={{ backgroundColor: "#1C1C1E" }}>
              <div className="flex items-center justify-between mb-6">
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                  Booking Detail
                </p>
                <button onClick={() => setSelected(null)}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "1rem" }}>
                  ✕
                </button>
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-rose flex items-center justify-center mb-4"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", color: "#FDFAF5" }}>
                {selected.name.charAt(0).toUpperCase()}
              </div>

              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#FDFAF5", fontWeight: 500, marginBottom: "4px" }}>
                {selected.name}
              </h3>

              <div className="flex flex-col gap-4 mt-4">
                {[
                  { label: "Phone",   value: selected.phone },
                  { label: "Email",   value: selected.email || "—" },
                  { label: "Service", value: selected.service },
                  { label: "Date",    value: selected.date },
                  { label: "Time",    value: selected.time || "—" },
                  { label: "Message", value: selected.message || "—" },
                ].map(row => (
                  <div key={row.label}>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "3px" }}>
                      {row.label}
                    </p>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Status update */}
              <div className="mt-6 pt-4 border-t border-white/8">
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>
                  Update Status
                </p>
                <div className="flex flex-col gap-2">
                  {statusOptions.map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className="py-2 text-[10px] tracking-[0.15em] uppercase transition-all duration-200"
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        backgroundColor: selected.status === s ? `${statusColor[s]}25` : "transparent",
                        color: selected.status === s ? statusColor[s] : "rgba(255,255,255,0.3)",
                        border: `1px solid ${selected.status === s ? statusColor[s] : "rgba(255,255,255,0.08)"}`,
                        cursor: "pointer",
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}