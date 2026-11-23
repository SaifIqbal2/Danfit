import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom OEM Sportswear Manufacturing",
  description:
    "Custom OEM and ODM sportswear manufacturing in Sialkot with low MOQs, sample development and worldwide shipping.",
  alternates: { canonical: "/custom-manufacturing" },
};

export default function ManufacturingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
