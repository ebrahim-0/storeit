"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "AbortController" in window) {
      const controller = new AbortController();
      controller.abort();
    }
  }, []);

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

        {/* Buttons Container */}
        <div className="mt-6 flex items-center justify-center gap-4">
          {/* Back to Home Button */}
          <Button>
            <Link href="/">Go Back Home</Link>
          </Button>

          {/* Refresh Button */}
          <Button variant="outline" onClick={handleRefresh}>
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}
