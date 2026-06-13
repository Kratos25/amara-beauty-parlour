"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { adminLogout } from "@/lib/auth";

const navItems = [
  { label: "Dashboard",    href: "/admin/dashboard",    icon: "◈" },
  { label: "Bookings",     href: "/admin/bookings",     icon: "◆" },
  { label: "Customers",    href: "/admin/customers",    icon: "✦" },
  { label: "Gallery",      href: "/admin/gallery",      icon: "❋" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "◇" },
  { label: "Before & After",href: "/admin/before-after", icon: "◉" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/admin/login");
      else setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await adminLogout();
    router.replace("/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#111111" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          border: "2px solid #B5485A", borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#111111" }}>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16 md:w-56"}`}
        style={{ backgroundColor: "#1C1C1E", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="px-4 py-6 border-b border-white/6">
          <div className={`overflow-hidden transition-all duration-300`}>
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.5rem", color: "#FDFAF5",
              fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap",
            }}>
              Amara
            </p>
            <p className="hidden md:block" style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "8px", letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#C9A96E",
              marginTop: "3px", whiteSpace: "nowrap",
            }}>
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="flex items-center gap-3 px-4 py-3 mx-2 my-0.5 transition-all duration-200"
                  style={{
                    backgroundColor: active ? "rgba(181,72,90,0.15)" : "transparent",
                    borderLeft: active ? "2px solid #B5485A" : "2px solid transparent",
                  }}
                >
                  <span style={{ color: active ? "#B5485A" : "#6B6460", fontSize: "0.9rem", minWidth: "16px" }}>
                    {item.icon}
                  </span>
                  <span
                    className="hidden md:block text-[11px] tracking-[0.12em] uppercase whitespace-nowrap"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      color: active ? "#FDFAF5" : "#6B6460",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-2 hover:text-rose transition-colors duration-200"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ color: "#6B6460", fontSize: "0.9rem" }}>→</span>
            <span className="hidden md:block text-[11px] tracking-[0.12em] uppercase"
              style={{ fontFamily: "var(--font-dm-sans)", color: "#6B6460" }}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 md:ml-56 ml-16 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/6"
          style={{ backgroundColor: "#1C1C1E" }}>
          <p className="text-white/40 text-[11px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-dm-sans)" }}>
            {navItems.find(n => n.href === pathname)?.label ?? "Admin"}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <p className="text-white/30 text-[10px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Online
            </p>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}