import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Sialkot Factory",
  description:
    "Learn about DanFit Industry, its Sialkot manufacturing facility, craftsmanship, quality standards and global exports.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
