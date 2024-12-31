"use client";

import { useSelector } from "zustore";

export default function Home() {
  const user = useSelector<IUser>("user");

  return (
    <div className="flex-center h-[calc(100vh-111px)] flex-col gap-3">
      <h1 className="h1">Welcome, {user?.fullName}</h1>

      <h1 className="h1">StoreIt - A simple file storage service</h1>
    </div>
  );
}
