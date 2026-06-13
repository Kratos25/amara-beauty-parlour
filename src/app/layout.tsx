import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import FloatingButtons from "@/components/ui/FloatingButtons";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#B5485A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  // ── Core ──
  title: {
    default: "Amara Beauty Parlour | Luxury Beauty & Wellness",
    template: "%s | Amara Beauty Parlour",
  },
  description:
    "Amara Beauty Parlour offers premium hair, skin, nail and bridal services. Expert stylists, luxurious treatments and a warm welcoming experience. Book your appointment today.",
  keywords: [
    "beauty parlour",
    "salon",
    "hair salon",
    "bridal makeup",
    "facial",
    "nail art",
    "keratin treatment",
    "Amara beauty",
    "beauty parlour near me",
    "luxury salon",
    "skin care",
    "waxing",
    "threading",
    "spa",
  ],
  authors: [{ name: "Amara Beauty Parlour" }],
  creator: "Amara Beauty Parlour",

  // ── Open Graph (WhatsApp, Facebook previews) ──
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://amarabeauty.com",
    siteName: "Amara Beauty Parlour",
    title: "Amara Beauty Parlour | Luxury Beauty & Wellness",
    description:
      "Premium hair, skin, nail and bridal services. Expert stylists and luxurious treatments. Book your appointment today.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Amara Beauty Parlour",
      },
    ],
  },

  // ── Twitter / X card ──
  twitter: {
    card: "summary_large_image",
    title: "Amara Beauty Parlour | Luxury Beauty & Wellness",
    description:
      "Premium hair, skin, nail and bridal services. Book your appointment today.",
    images: ["/images/og-image.jpg"],
  },

  // ── Icons ──
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // ── Robots ──
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Canonical URL ──
  alternates: {
    canonical: "https://amarabeauty.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {/* Local Business Schema — helps Google show your business in search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              name: "Amara Beauty Parlour",
              description:
                "Premium hair, skin, nail and bridal beauty services.",
              url: "https://amarabeauty.com",
              telephone: "+91-99999-99999",
              priceRange: "₹₹",
              image: "https://amarabeauty.com/images/og-image.jpg",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Your Street Address",
                addressLocality: "Your City",
                addressRegion: "Your State",
                postalCode: "000000",
                addressCountry: "IN",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "09:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Sunday"],
                  opens: "10:00",
                  closes: "18:00",
                },
              ],
              sameAs: [
                "https://www.instagram.com/amarabeauty",
                "https://www.facebook.com/amarabeauty",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Beauty Services",
                itemListElement: [
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hair Cut & Styling" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bridal Makeup" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hydra Facial" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Nail Art & Extensions" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Keratin Treatment" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Body Polishing" } },
                ],
              },
            }),
          }}
        />
      </head>
      <body style={{ backgroundColor: "#FDFAF5", color: "#1C1C1E" }}>
        {children}
        <FloatingButtons />
      </body>
    </html>
  );
}