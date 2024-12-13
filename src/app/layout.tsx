import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Root from "@/components/Root";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt is a simple file storage service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="ltr" lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <Root>{children}</Root>
        <Toaster />
      </body>
    </html>
  );
}
