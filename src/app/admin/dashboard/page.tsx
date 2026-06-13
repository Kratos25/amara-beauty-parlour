"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";

interface Booking {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
  createdAt: { seconds: number };
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalCustomers: 0,
    pendingBookings: 0,
    totalGallery: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsSnap, customersSnap, gallerySnap] = await Promise.all([
          getDocs(collection(db, COLLECTIONS.bookings)),
          getDocs(collection(db, COLLECTIONS.customers)),
          getDocs(collection(db, COLLECTIONS.gallery)),
        ]);

        const bookings = bookingsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[];
        const pending = bookings.filter(b => b.status === "pending").length;

        setStats({
          totalBookings:  bookings.length,
          totalCustomers: customersSnap.size,
          pendingBookings: pending,
          totalGallery:   gallerySnap.size,
        });

        // Recent 5 bookings
        const recent = query(collection(db, COLLECTIONS.bookings), orderBy("createdAt", "desc"), limit(5));
        const recentSnap = await getDocs(recent);
        setRecentBookings(recentSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Booking[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Total Bookings",   value: stats.totalBookings,   icon: "◆", color: "#B5485A" },
    { label: "Total Customers",  value: stats.totalCustomers,  icon: "✦", color: "#C9A96E" },
    { label: "Pending",          value: stats.pendingBookings, icon: "◈", color: "#F59E0B" },
    { label: "Gallery Images",   value: stats.totalGallery,    icon: "❋", color: "#10B981" },
  ];

  const statusColor: Record<string, string> = {
    pending:   "#F59E0B",
    confirmed: "#10B981",
    completed: "#6B7280",
    cancelled: "#EF4444",
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#FDFAF5", fontWeight: 300 }}>
            Welcome back 👋
          </h1>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
            Here's what's happening at Amara Beauty Parlour
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label}
              className="p-6 border border-white/8"
              style={{ backgroundColor: "#1C1C1E" }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ color: s.color, fontSize: "1.2rem" }}>{s.icon}</span>
              </div>
              <p style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "2.5rem", color: "#FDFAF5",
                fontWeight: 500, lineHeight: 1,
              }}>
                {loading ? "—" : s.value}
              </p>
              <p style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "9px", letterSpacing: "0.2em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
                marginTop: "6px",
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="border border-white/8" style={{ backgroundColor: "#1C1C1E" }}>
          <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              Recent Bookings
            </p>
            <a href="/admin/bookings"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "#C9A96E", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              View all →
            </a>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>Loading...</p>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="p-8 text-center">
              <p style={{ fontFamily: "var(--font-dm-sans)", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No bookings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/6">
                    {["Name", "Service", "Date", "Time", "Status"].map((h) => (
                      <th key={h} className="text-left px-6 py-3"
                        style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4">
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.875rem", color: "#FDFAF5" }}>{b.name}</p>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{b.phone}</p>
                      </td>
                      <td className="px-6 py-4" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{b.service}</td>
                      <td className="px-6 py-4" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{b.date}</td>
                      <td className="px-6 py-4" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{b.time || "—"}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-[9px] tracking-[0.1em] uppercase"
                          style={{
                            fontFamily: "var(--font-dm-sans)",
                            backgroundColor: `${statusColor[b.status] || "#6B7280"}20`,
                            color: statusColor[b.status] || "#6B7280",
                          }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}