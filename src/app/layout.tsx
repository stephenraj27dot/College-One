import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContactWidget } from "@/components/layout/FloatingContactWidget";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Tamil Nadu College Discovery & Cutoff Guide`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Tamil Nadu Colleges",
    "TNEA Cutoff 2026",
    "Engineering Colleges in Chennai",
    "Top Engineering Colleges in Coimbatore",
    "Medical Colleges in Tamil Nadu",
    "Anna University Affiliated Colleges",
    "College of Engineering Guindy CEG",
    "PSG Tech Coimbatore",
    "SSN College of Engineering",
    "TNEA Rank List",
    "Tamil Nadu Admission Guidance",
  ],
  authors: [{ name: "College Guide Editorial Team" }],
  creator: "College Guide",
  publisher: "College Guide",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "College Guide Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global JSON-LD Schema for Educational Organization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden w-full">
        <Header />
        <main className="flex-1">{children}</main>
        <FloatingContactWidget />
        <Footer />
      </body>
    </html>
  );
}
