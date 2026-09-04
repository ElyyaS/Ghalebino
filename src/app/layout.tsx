import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const runtime = "nodejs";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "قالبی نو | مارکت‌پلیس قالب و محصولات وب",
    template: "%s | قالبی نو",
  },
  description:
    "قالبی نو، مارکت‌پلیس تخصصی قالب‌های وب؛ خرید و فروش قالب HTML، React، Next.js، وردپرس، داشبورد و رابط کاربری با پشتیبانی فارسی.",
  keywords: ["قالب", "مارکت", "قالب وب", "وردپرس", "ری‌اکت", "نکست", "قالب فروشگاهی"],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    title: "قالبی نو | مارکت‌پلیس قالب و محصولات وب",
    description: "خرید و فروش قالب‌های حرفه‌ای وب برای توسعه‌دهندگان فارسی‌زبان.",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}