import { Geist, Geist_Mono, Quicksand } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import type { Metadata } from "next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OfferScope | Compensation Intelligence",
  description:
    "Real-time salary data and intelligence for modern professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-quicksand">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              OfferScope<span className="text-primary">.</span>
            </Link>
            <Navigation />
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
