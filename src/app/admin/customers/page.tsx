"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings: number;
  firstBooking: { seconds: number };
  lastBooking: { seconds: number };
  lastService: string;
}

interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
  createdAt: { seconds: number };
}

const statusColor: Record<string, string> = {
  pending:   "#F59E0B",
  confirmed: "#10B981",
  completed: "#6B7280",
  cancelled: "#EF4444",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [sortBy, setSortBy] = useState<"totalBookings" | "lastBooking">("lastBooking");

  useEffect(() => { fetchCustomers(); }, []);

  useEffect(() => {
    let list = [...customers];
    if (search) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    list.sort((a, b) => {
      if (sortBy === "totalBookings") return b.totalBookings - a.totalBookings;
      return (b.lastBooking?.seconds ?? 0) - (a.lastBooking?.seconds ?? 0);
    });
    setFiltered(list);
  }, [search, customers, sortBy]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.customers));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Customer[];
      setCustomers(data);
      setFiltered(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchCustomerBookings = async (phone: string) => {
    setLoadingBookings(true);
    try {
      const q = query(
        collection(db, COLLECTIONS.bookings),
        where("phone", "==", phone),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setCustomerBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[]);
    } catch (err) { console.error(err); }
    finally { setLoadingBookings(false); }
  };

  const selectCustomer = (c: Customer) => {
    setSelected(c);
    fetchCustomerBookings(c.phone);
  };

  const formatDate = (seconds?: number) => {
    if (!seconds) return "—";
    return new Date(seconds * 1000).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const getBadgeColor = (count: number) => {
    if (count >= 5) return "#C9A96E";
    if (count >= 3) return "#B5485A";
    return "#6B7280";
  };

  const getBadgeLabel = (count: number) => {
    if (count >= 5) return "VIP";
    if (count >= 3) return "Regular";
    return "New";
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#FDFAF5", fontWeight: 300 }}>
              Customers
            </h1>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
              {filtered.length} of {customers.length} customers
            </p>
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            {[
              { label: "By Last Visit",   value: "lastBooking" },
              { label: "By Total Visits", value: "totalBookings" },
            ].map(s => (
              <button key={s.value}
                onClick={() => setSortBy(s.value as typeof sortBy)}
                className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase transition-all duration-200"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  backgroundColor: sortBy === s.value ? "rgba(181,72,90,0.15)" : "transparent",
                  color: sortBy === s.value ? "#B5485A" : "rgba(255,255,255,0.35)",
                  border: `1px solid ${sortBy === s.value ? "#B5485A" : "rgba(255,255,255,0.1)"}`,
                  cursor: "pointer",
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full max-w-md bg-transparent border border-white/15 text-ivory placeholder:text-white/25 px-4 py-2.5 text-sm outline-none focus:border-gold transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
        </div>

        <div className="flex gap-6">

          {/* Customer List */}
          <div className="flex-1 flex flex-col gap-3">
            {loading ? (
              <div className="p-12 text-center border border-white/8" style={{ backgroundColor: "#1C1C1E" }}>
                <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)" }}>Loading customers...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center border border-white/8" style={{ backgroundColor: "#1C1C1E" }}>
                <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)" }}>No customers found.</p>
              </div>
            ) : filtered.map(c => (
              <div
                key={c.id}
                onClick={() => selectCustomer(c)}
                className="flex items-center gap-4 px-5 py-4 border cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: selected?.id === c.id ? "rgba(181,72,90,0.08)" : "#1C1C1E",
                  borderColor: selected?.id === c.id ? "rgba(181,72,90,0.3)" : "rgba(255,255,255,0.06)",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${getBadgeColor(c.totalBookings)}20`,
                    border: `1px solid ${getBadgeColor(c.totalBookings)}40`,
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.2rem",
                    color: getBadgeColor(c.totalBookings),
                  }}
                >
                  {c.name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", color: "#FDFAF5" }}>
                      {c.name}
                    </p>
                    {/* Badge */}
                    <span className="px-2 py-0.5 text-[8px] tracking-[0.1em] uppercase"
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        backgroundColor: `${getBadgeColor(c.totalBookings)}20`,
                        color: getBadgeColor(c.totalBookings),
                      }}>
                      {getBadgeLabel(c.totalBookings)}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>
                    {c.phone} {c.email ? `· ${c.email}` : ""}
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", color: "#B5485A", fontWeight: 500, lineHeight: 1 }}>
                    {c.totalBookings}
                  </p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                    visits
                  </p>
                </div>

                {/* Last visit */}
                <div className="text-right flex-shrink-0 hidden md:block">
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                    {formatDate(c.lastBooking?.seconds)}
                  </p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
                    last visit
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Customer Detail Panel */}
          {selected && (
            <div className="w-80 flex-shrink-0 border border-white/8"
              style={{ backgroundColor: "#1C1C1E", height: "fit-content" }}>

              {/* Profile header */}
              <div className="p-6 border-b border-white/8">
                <div className="flex items-center justify-between mb-4">
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                    Customer Profile
                  </p>
                  <button onClick={() => setSelected(null)}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>✕</button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${getBadgeColor(selected.totalBookings)}20`,
                      border: `2px solid ${getBadgeColor(selected.totalBookings)}`,
                      fontFamily: "var(--font-cormorant)", fontSize: "1.6rem",
                      color: getBadgeColor(selected.totalBookings),
                    }}>
                    {selected.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: "#FDFAF5", fontWeight: 500 }}>
                      {selected.name}
                    </h3>
                    <span className="px-2 py-0.5 text-[8px] tracking-[0.1em] uppercase"
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        backgroundColor: `${getBadgeColor(selected.totalBookings)}20`,
                        color: getBadgeColor(selected.totalBookings),
                      }}>
                      {getBadgeLabel(selected.totalBookings)}
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Total Visits", value: selected.totalBookings },
                    { label: "First Visit",  value: formatDate(selected.firstBooking?.seconds) },
                    { label: "Last Visit",   value: formatDate(selected.lastBooking?.seconds) },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2 border border-white/8">
                      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: typeof s.value === "number" ? "1.8rem" : "0.85rem", color: "#B5485A", fontWeight: 500, lineHeight: 1.2 }}>
                        {s.value}
                      </p>
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "7px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: "3px" }}>
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Phone",        value: selected.phone },
                    { label: "Email",        value: selected.email || "—" },
                    { label: "Last Service", value: selected.lastService || "—" },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-1 border-b border-white/5">
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                        {row.label}
                      </p>
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking History */}
              <div className="p-6">
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>
                  Booking History
                </p>

                {loadingBookings ? (
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>Loading...</p>
                ) : customerBookings.length === 0 ? (
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>No bookings found.</p>
                ) : (
                  <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
                    {customerBookings.map((b, i) => (
                      <div key={b.id} className="flex gap-3 items-start">
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center mt-1">
                          <div className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: statusColor[b.status] || "#6B7280" }} />
                          {i < customerBookings.length - 1 && (
                            <div className="w-px flex-1 mt-1" style={{ backgroundColor: "rgba(255,255,255,0.06)", minHeight: "24px" }} />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginBottom: "2px" }}>
                            {b.service}
                          </p>
                          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                            {b.date} {b.time ? `· ${b.time}` : ""}
                          </p>
                          <span className="text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 mt-1 inline-block"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              backgroundColor: `${statusColor[b.status]}20`,
                              color: statusColor[b.status] || "#6B7280",
                            }}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}