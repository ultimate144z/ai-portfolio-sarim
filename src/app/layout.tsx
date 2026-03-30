import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ParticleBackground from "@/components/ui/ParticleBackground";
import "./globals.css";

// Load Inter font for non-Apple devices
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Sarim Farooq - AI Developer & Engineer",
    template: "%s | Sarim Farooq Portfolio"
  },
  description: "Applied AI Engineer specializing in production LLM systems, RAG pipelines, and intelligent automation — deployed across fintech and enterprise.",
  keywords: [
    "Sarim Farooq",
    "AI Developer", 
    "AI Engineer",
    "Portfolio",
    "Software Developer",
    "Machine Learning",
    "LLM Systems",
    "RAG Pipelines",
    "Next.js",
    "React",
    "FastAPI",
    "Python Developer",
    "Automation",
    "LangChain",
    "Professional Portfolio",
    "Developer Portfolio",
    "Tech Portfolio",
    "API Development"
  ],
  authors: [
    {
      name: "Sarim Farooq",
      url: "https://sarimfarooq.dev/",
    },
  ],
  creator: "Sarim Farooq",
  publisher: "Sarim Farooq",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sarimfarooq.dev/",
    title: "Sarim Farooq - AI Developer & Engineer",
    description: "Professional portfolio showcasing AI-powered projects, LLM systems, and full-stack development. Built by Sarim Farooq.",
    siteName: "Sarim Farooq Portfolio",
    images: [
      {
        url: "/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Sarim Farooq - AI Developer Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarim Farooq - AI Developer & Engineer",
    description: "Professional portfolio showcasing AI projects, LLM systems, and automation solutions.",
    creator: "@ultimate144z",
    site: "@ultimate144z",
    images: [{
      url: "/portfolio.png",
      alt: "Sarim Farooq Professional Portfolio"
    }],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      }
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-touch-icon.svg?v=2",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://sarimfarooq.dev/",
  },
  category: "technology",
  classification: "Portfolio Website",
  other: {
    "google-site-verification": "your-google-verification-code-here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://sarimfarooq.dev/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Sarim Farooq",
              "jobTitle": "AI Developer & Engineer",
              "url": "https://sarimfarooq.dev/",
              "image": "https://sarimfarooq.dev/profile.jpeg",
              "sameAs": [
                "https://github.com/ultimate144z",
                "https://linkedin.com/in/sarim-farooq-44297727a"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "GO-Globe"
              },
              "alumniOf": {
                "@type": "Organization",
                "name": "FAST-NUCES Islamabad"
              },
              "knowsAbout": [
                "Python Development",
                "AI Engineering",
                "Machine Learning",
                "NLP",
                "Computer Vision",
                "RAG Pipelines",
                "Automation",
                "LLM Systems"
              ],
              "description": "Applied AI Engineer specializing in production LLM systems, RAG pipelines, and intelligent automation — deployed across fintech and enterprise."
            })
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          <ParticleBackground />
          <main className="flex min-h-screen flex-col relative z-10">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}