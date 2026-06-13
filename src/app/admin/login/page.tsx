"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true);
    setError("");
    try {
      await adminLogin(email, password);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#111111" }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <p style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "2.5rem",
            color: "#FDFAF5",
            fontWeight: 500,
            lineHeight: 1,
            marginBottom: "4px",
          }}>
            Amara
          </p>
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "9px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#C9A96E",
          }}>
            Admin Panel
          </p>
          <div className="w-12 h-px mx-auto mt-4"
            style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
        </div>

        {/* Card */}
        <div className="border border-white/10 p-8" style={{ backgroundColor: "#1C1C1E" }}>
          <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase mb-6"
            style={{ fontFamily: "var(--font-dm-sans)" }}>
            Sign in to continue
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-white/40 text-[9px] tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-dm-sans)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@amarabeauty.com"
                className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-3 text-sm outline-none focus:border-rose transition-colors duration-200"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white/40 text-[9px] tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-dm-sans)" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="bg-transparent border border-white/15 text-ivory placeholder:text-white/20 px-4 py-3 text-sm outline-none focus:border-rose transition-colors duration-200"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-rose text-[11px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                ⚠ {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose text-ivory py-3.5 text-[11px] tracking-[0.25em] uppercase hover:bg-rose-light transition-colors duration-200 mt-2 disabled:opacity-60"
              style={{ fontFamily: "var(--font-dm-sans)", border: "none", cursor: "pointer" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-[10px] mt-6"
          style={{ fontFamily: "var(--font-dm-sans)" }}>
          Amara Beauty Parlour © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}