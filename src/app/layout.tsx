import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saint Mary School, Rajula | Best School in Rajula, Gujarat | GSEB Affiliated",
  description:
    "Saint Mary School, Rajula is the best school in Rajula, Gujarat. GSEB affiliated, offering quality education from Nursery to Class 8 since 2011. Safe campus, smart classrooms, experienced teachers, and holistic development at Krishna Park, Chhatdiya Road, Rajula - 365560, Amreli.",
  keywords: [
    "Saint Mary School Rajula",
    "saintmaryschoolrajula",
    "schools in Rajula",
    "best school in Rajula",
    "school near me",
    "schools in Rajula Gujarat",
    "top schools in Rajula",
    "Rajula school admission",
    "GSEB school Rajula",
    "primary school Rajula",
    "nursery school Rajula",
    "English medium school Rajula",
    "schools in Amreli district",
    "best schools in Amreli",
    "school in Gujarat",
    "GSEB affiliated school",
    "Saint Mary School",
    "Rajula education",
    "Gujarat school admission",
    "private school Rajula",
    "pre-primary school Rajula",
    "kindergarten Rajula",
    "schools near Rajula",
    "educational institutions Rajula",
    "quality education Rajula",
    "smart classroom school Gujarat",
    "safe school Rajula",
    "co-ed school Rajula",
    "Rajula 365560 school",
    "Chhatdiya Road school",
    "Krishna Park school",
    "Saurashtra school",
  ],
  authors: [{ name: "Saint Mary School, Rajula" }],
  creator: "Saint Mary School, Rajula",
  publisher: "Saint Mary School, Rajula",
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
    locale: "en_IN",
    url: "https://www.saintmaryschoolrajula.com",
    siteName: "Saint Mary School, Rajula",
    title: "Saint Mary School, Rajula | Best School in Rajula, Gujarat",
    description:
      "Discover the best school in Rajula - Saint Mary School. GSEB affiliated, Nursery to Class 8. Smart classrooms, experienced teachers, safe campus. Admissions open!",
    images: [
      {
        url: "/hero-school.jpg",
        width: 1200,
        height: 630,
        alt: "Saint Mary School, Rajula - Best School in Rajula, Gujarat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saint Mary School, Rajula | Best School in Rajula, Gujarat",
    description:
      "GSEB affiliated school in Rajula offering Nursery to Class 8. Smart classrooms, safe campus, experienced teachers. Admissions open!",
    images: ["/hero-school.jpg"],
  },
  alternates: {
    canonical: "https://www.saintmaryschoolrajula.com",
  },
  category: "education",
  verification: {
    google: "google3aec4bf92bc9b60c.html",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/school-logo.png",
  },
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Rajula, Amreli, Gujarat, India",
    "geo.position": "21.9;71.4",
    ICBM: "21.9, 71.4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${poppins.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}