"use client";

import { Button } from "@/components/ui/button";
import { sendSmsOtp } from "@/lib/actions/user.action";

export default function Home() {
  const send = async () => {
    const res = await sendSmsOtp();
    console.log("🚀 ~ onClick={ ~ res:", res);
  };

  return (
    <div className="flex-center h-[calc(100vh-111px)]">
      <h1 className="h1">StoreIt - A simple file storage service</h1>

      <Button onClick={send}>send message</Button>
    </div>
  );
}
