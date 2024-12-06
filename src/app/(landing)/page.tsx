"use client";

import { Button } from "@/components/ui/button";
import UserData from "@/components/UserData";
import { sendSmsOtp } from "@/lib/actions/user.action";
import { useDispatch, useSelector } from "zustate-plus";

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
    <div className="flex-center h-[calc(100vh-111px)]">
      {age}
      <h1 className="h1">StoreIt - A simple file storage service</h1>
      <UserData />
      <Button onClick={send}>send message</Button>
      <Button onClick={setAge}>set age</Button>
    </div>
  );
}
