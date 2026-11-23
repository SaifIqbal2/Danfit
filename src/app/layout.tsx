import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://danfitindustry.com"),
  title: {
    default: "DanFit Industry | Sportswear Manufacturer in Sialkot",
    template: "%s | DanFit Industry",
  },
  description:
    "DanFit Industry is a Sialkot-based custom sportswear, clothing and B2B OEM manufacturer with low MOQs and worldwide delivery.",
  keywords: [
    "sportswear manufacturer Sialkot",
    "custom clothing manufacturer Pakistan",
    "OEM sportswear",
    "ODM sportswear",
    "teamwear manufacturer",
    "hoodies manufacturer",
    "tracksuits manufacturer",
    "wholesale activewear",
  ],
  authors: [{ name: "DanFit Industry" }],
  creator: "DanFit Industry",
  publisher: "DanFit Industry",
  applicationName: "DanFit Industry",
  alternates: { canonical: "/" },
  category: "manufacturing",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "DanFit Industry | Clothing & Sportswear, Sialkot",
    description: "High-end clothing and sportswear engineered in Sialkot, Pakistan.",
    url: "https://danfitindustry.com",
    siteName: "DanFit Industry",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "DanFit Industry",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#08080a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
      </head>
      <body className="antialiased bg-[#eaebf2] text-[#08080a]">
        <ScrollProgressBar />
        <CartProvider>{children}</CartProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DanFit Industry",
              url: "https://danfitindustry.com",
              logo: "https://danfitindustry.com/images/logo.png",
              description:
                "Custom sportswear and clothing manufacturer based in Sialkot, Pakistan.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Sialkot",
                addressRegion: "Punjab",
                addressCountry: "PK",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+92-328-5850057",
                contactType: "sales",
                availableLanguage: ["English", "Urdu"],
              },
              sameAs: [
                "https://facebook.com/danfitindustry",
                "https://instagram.com/danfit_industry",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
