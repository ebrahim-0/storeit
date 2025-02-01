import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Root from "@/components/Root";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt is a simple file storage service for everyone.",
  icons: {
    icon: ["/assets/standaloneIcons/logo.svg"],
    apple: ["/assets/standaloneIcons/logo.svg"],
    shortcut: ["/assets/standaloneIcons/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "StoreIt",
    description: "StoreIt is a simple file storage service for everyone.",
    site: "@StoreItApp",
    images: ["/assets/standaloneIcons/logo.svg"],
  },

  openGraph: {
    title: "StoreIt",
    description: "StoreIt is a simple file storage service for everyone.",
    url: "https://store-it.live",
    images: [
      {
        url: "/assets/standaloneIcons/logo.svg",
        alt: "StoreIt Banner",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="ltr" lang="en">
      <Head>
        <link
          rel="preload"
          href="/sprite.svg"
          as="image"
          type="image/svg+xml"
        />
      </Head>
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <Root>{children}</Root>
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!body-2     !border-0 !text-white",
          }}
        />
      </body>
    </html>
  );
}
