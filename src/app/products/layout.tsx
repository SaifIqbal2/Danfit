import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sportswear Products & MOQs",
  description:
    "Browse DanFit Industry sportswear, hoodies, tracksuits, teamwear and low-MOQ manufacturing options from Sialkot, Pakistan.",
  alternates: { canonical: "/products" },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
