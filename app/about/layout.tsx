import type { Metadata } from "next";

// La page est un Client Component : ses métadonnées passent par ce layout.
export const metadata: Metadata = {
  title: "À propos de l'ADUTI",
  description:
    "Histoire, missions et organisation de l'Association des DUT et DTS en Informatique de l'INP-HB.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "À propos de l'ADUTI",
    description:
      "Histoire, missions et organisation de l'Association des DUT et DTS en Informatique de l'INP-HB.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
