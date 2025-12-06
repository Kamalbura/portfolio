import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import Navigation from "@/components/layout/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.burakamal.site"),
  title: {
    default: "Kamal Bura | IoT & ML Developer",
    template: "%s | Kamal Bura",
  },
  description:
    "Fourth-year Computer Science student building IoT products and machine learning prototypes for classrooms, labs, and freelance teams.",
  keywords: [
    "Kamal Bura",
    "IoT developer",
    "Machine learning",
    "Next.js portfolio",
    "Lenis GSAP animations",
    "Freelance IoT projects",
  ],
  authors: [{ name: "Kamal Bura" }],
  openGraph: {
    type: "website",
    url: "https://www.burakamal.site",
    title: "Kamal Bura | IoT & ML Developer",
    description:
      "Interactive portfolio of Kamal Bura showcasing IoT systems, ML experiments, and immersive web interfaces.",
    siteName: "Kamal Bura Portfolio",
    locale: "en_US",
    images: [
      {
        url: "https://www.burakamal.site/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Water-inspired hero banner for Kamal Bura's IoT and ML portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamal Bura | IoT & ML Developer",
    description:
      "Immersive portfolio for an IoT and ML developer exploring smooth interactions and responsive experiences.",
    creator: "@burakamal",
    images: ["https://www.burakamal.site/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.burakamal.site",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Pre-hydration theme script to avoid flash and SSR/CSR drift */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    var ls = localStorage.getItem('darkMode');
    var shouldDark = ls === 'true' || (ls === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var cn = document.documentElement.classList;
    if (shouldDark) cn.add('dark'); else cn.remove('dark');
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ClientLayout>
          <Navigation />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
