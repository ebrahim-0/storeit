"use client";

import { useSelector } from "zustore";

export default function Home() {
  const fullName = useSelector(({ user }) => user?.fullName);

  return (
    <div className="flex-center h-[calc(100vh-111px)] flex-col gap-3 text-center">
      <h1 className="h3 sm:h2 md:h1">
        Welcome {fullName && `, ${fullName}`} to StoreIt
      </h1>
      <h1 className="h3 sm:h2 md:h1">
        StoreIt - A simple file storage service
      </h1>
    </div>
  );
}
