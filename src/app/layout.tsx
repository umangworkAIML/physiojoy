import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhysioJoy by Joyal — Book Physiotherapists, Clinics & More",
  description:
    "PhysioJoy by Joyal — Ahmedabad's premier physiotherapy platform. Book certified physiotherapists for home visits, discover nearby clinics, get online consultations, and shop premium recovery products.",
  keywords: [
    "physiotherapy",
    "Ahmedabad",
    "physiotherapist",
    "home visit",
    "clinic",
    "physio",
    "therapy",
    "pain relief",
    "rehabilitation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 pt-16 md:pt-18">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
