"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserData from "@/components/UserData";
import { sendSmsOtp } from "@/lib/actions/user.action";
import { useState } from "react";
import { useDispatch, useSelector } from "zustate-add";

export default function Home() {
  const { dispatcher } = useDispatch();
  const { age } = useSelector("info");

  const [state, setState] = useState("");

  const send = async () => {
    const res = await sendSmsOtp();
    console.log("🚀 ~ onClick={ ~ res:", res);
  };

  const setAge = () => {
    dispatcher("setAge", { value: age + 1 });
  };

  return (
    <div className="flex-center flex-col gap-3 h-[calc(100vh-111px)]">
      <p className="subtitle-2">{state}</p>
      <Input onChange={(e) => setState(e.target.value)} />
      <h1 className="h1">{age}</h1>
      <h1 className="h1">StoreIt - A simple file storage service</h1>
      <UserData />
      <Button onClick={send}>send message</Button>
      <Button onClick={setAge}>set age</Button>
    </div>
  );
}
