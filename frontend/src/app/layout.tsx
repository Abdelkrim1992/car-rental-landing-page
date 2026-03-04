import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Renture - Premium Car Rental Agency",
  description: "Discover the thrill of driving luxury with our exclusive collection of well-maintained hypercars and sports cars available for rent.",
  keywords: ["car rental", "luxury cars", "sports cars", "hypercar rental", "Renture"],
  openGraph: {
    title: "Renture - Premium Car Rental Agency",
    description: "Drive your dream car today. Luxury & sports car rentals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ReduxProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </ReduxProvider>
      </body>
    </html>
  );
}
