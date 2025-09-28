import type { Metadata } from "next";
import { Geist, Geist_Mono, GFS_Neohellenic } from "next/font/google";
import "./globals.css";
import ClientBackgroundWrapper from "../components/ClientBackgroundWrapper";
import DecorativeLayout from "../components/DecorativeLayout";
import { AuthProvider } from "../components/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gfsNeohellenic = GFS_Neohellenic({
  variable: "--font-gfs-neohellenic",
  subsets: ["greek"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "GnosisLens",
  description: "Informed on what decevies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gfsNeohellenic.variable} antialiased`}
      >
        <AuthProvider>
          <ClientBackgroundWrapper />
          <DecorativeLayout>{children}</DecorativeLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
