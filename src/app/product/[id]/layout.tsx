import type { Metadata } from "next";
import { fetchProductById } from "@/lib/supabase";

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id);
  const { data } = await fetchProductById(id);

  if (!data) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: data.title,
    description: data.description || `${data.title} custom sportswear manufactured in Sialkot by DanFit Industry.`,
    alternates: { canonical: `/product/${id}` },
    openGraph: {
      title: data.title,
      description: data.description,
      images: data.image_url ? [{ url: data.image_url }] : ["/images/logo.png"],
      type: "website",
    },
  };
}

export default function ProductLayout({ children }: Props) {
  return children;
}
