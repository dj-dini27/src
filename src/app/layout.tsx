import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Informasi Sekolah",
  description: "Platform terintegrasi untuk manajemen sekolah modern",
  keywords: ["Sistem Sekolah", "Pendidikan", "Manajemen Sekolah", "Next.js", "TypeScript"],
  authors: [{ name: "Sekolah Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sistem Informasi Sekolah",
    description: "Platform terintegrasi untuk manajemen sekolah modern",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}