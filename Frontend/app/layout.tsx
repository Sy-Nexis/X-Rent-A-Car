import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FleetControl | Precision Logistics Operations Hub",
  description: "Real-time fleet operations, client registry, and logistics dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.cdnfonts.com/css/gilroy" rel="stylesheet" />
      </head>
      <body className="min-h-full font-sans antialiased bg-[#0e0e11] text-[#ffffff] h-full overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
