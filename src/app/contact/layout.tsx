import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact DanFit Industry",
  description:
    "Contact DanFit Industry in Sialkot for custom sportswear quotes, product specifications, samples and B2B orders.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
