import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Root from "@/components/Root";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt is a simple file storage service.",
  icons: {
    icon: ["/assets/standaloneIcons/logo.svg"],
    apple: ["/assets/standaloneIcons/logo.svg"],
    shortcut: ["/assets/standaloneIcons/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="ltr" lang="en">
      {/* <head>
        <link
          rel="preload"
          href="/sprite.svg"
          as="image"
          type="image/svg+xml"
        />
      </head> */}
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <Root>{children}</Root>
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!body-2 !text-white !border-0",
          }}
        />
      </body>
    </html>
  );
}
