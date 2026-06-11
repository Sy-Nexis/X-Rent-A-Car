import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FleetFlow Mobile | Precision Logistics Mobile Hub",
  description: "Real-time fleet operations, client registry, and logistics dashboard on mobile.",
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
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full font-sans antialiased bg-[#f8fafc] text-[#0f172a] h-full overflow-hidden select-none flex justify-center">
        {/* Constrain layout to a mobile container to preview mobile pages accurately */}
        <div className="w-full max-w-[440px] h-full bg-[#f8fafc] flex flex-col relative border-x border-[#e2e8f0] shadow-xl overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
