import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "xrent CAR | Fleet Operations Dashboard",
  description: "Real-time fleet operations dashboard for xrent CAR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased h-full dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-bg-base text-text-primary">
        {children}
      </body>
    </html>
  );
}
