import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saint Mary School, Rajula | Learning Today, Leading Tomorrow",
  description:
    "Saint Mary School, Rajula - A GSEB affiliated school offering quality education from Nursery to Class 8. Established in 2011, we provide a safe, nurturing environment for holistic development.",
  keywords: [
    "Saint Mary School",
    "Rajula",
    "GSEB",
    "Gujarat",
    "School",
    "Education",
    "Nursery",
    "Primary School",
  ],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
