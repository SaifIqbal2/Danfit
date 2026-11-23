import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sportswear Collections",
  description:
    "Explore DanFit Industry apparel collections and custom manufacturing divisions for clubs, gyms and global brands.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
