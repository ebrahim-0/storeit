import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "StoreIt | 404 Page Not Found",
  description: "The page you’re looking for doesn’t exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="space-y-6 text-center">
        {/* 404 Heading */}
        <h1 className="text-9xl font-bold text-primary">404</h1>

        {/* Subheading */}
        <h2 className="text-2xl font-semibold">Oops! Page Not Found</h2>

        {/* Description */}
        <p className="text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <Button className="mt-6">
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
