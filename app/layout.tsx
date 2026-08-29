import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppShell } from "@/components/app-shell";
import { WelcomeConfetti } from "@/components/WelcomeConfetti";
import { AuthErrorListener } from "@/components/AuthErrorListener";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { getDictionaryFor } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://aduticsi.com")
  ),
  title: "ADUTI - Association des DUT et DTS en Informatique de l'INP-HB",
  description:
    "Plateforme officielle de l'Association des DUT et DTS en Informatique de l'INP-HB : Apprenez-en plus sur l'association et découvrez les membres, les promotions et les différentes activités de la communauté",
  applicationName: "Aduticsi",
  authors: [{ name: "ADUTI", url: "https://aduticsi.com" }],
  generator: "Next.js",
  keywords: ["ADUTI", "INP-HB", "Informatique", "DUT", "DTS", "Yamoussoukro", "Côte d'Ivoire", "TIC"],
  referrer: "origin-when-cross-origin",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  creator: "Clover INP-HB",
  publisher: "Aduticsi",
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://aduticsi.com",
    siteName: "Aduticsi",
    title: "ADUTI - Association des DUT et DTS en Informatique de l'INP-HB",
    description: "Plateforme officielle de l'Association des DUT et DTS en Informatique de l'INP-HB : apprenez-en plus sur l'association et découvrez les membres, les promotions et les différentes activités de la communauté",
    images: [
      {
        url: "/logo_association.jpeg",
        width: 640,
        height: 320,
        alt: "Logo ADUTI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADUTI - Association des DUT et DTS en Informatique de l'INP-HB",
    description: "Plateforme officielle de l'Association des DUT et DTS en Informatique de l'INP-HB",
    images: ["/logo_association.jpeg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dictionary = getDictionaryFor(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <LanguageProvider locale={locale} dictionary={dictionary}>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
        <Toaster position="top-center" richColors />
        <WelcomeConfetti />
        <AuthErrorListener />
      </body>
    </html>
  );
}
