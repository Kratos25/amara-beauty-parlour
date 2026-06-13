import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Amara Beauty Parlour",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#111111", color: "#FDFAF5", minHeight: "100vh" }}>
      {children}
    </div>
  );
}