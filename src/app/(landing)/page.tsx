"use client";

import { Button } from "@/components/ui/button";
import UserData from "@/components/UserData";
import { sendSmsOtp } from "@/lib/actions/user.action";
import { useDispatch, useSelector } from "zustore";

export default function Home() {
  const { dispatcher } = useDispatch();
  const { age } = useSelector("info");

  const send = async () => {
    const res = await sendSmsOtp();
    console.log("🚀 ~ onClick={ ~ res:", res);
  };

  const setAge = () => {
    dispatcher("setAge", { value: age + 1 });
  };

  return (
    <div className="flex-center flex-col gap-3 h-[calc(100vh-111px)]">
      <h1 className="h1">{age}</h1>
      <h1 className="h1">StoreIt - A simple file storage service</h1>
      <UserData />
      <Button onClick={send}>send message</Button>
      <Button onClick={setAge}>set age</Button>
    </div>
  );
}
