"use client";

import { Button } from "@/components/ui/button";
import UserData from "@/components/UserData";
import { useDispatch, useSelector } from "zustore";

export default function Home() {
  // const { dispatcher } = useDispatch();
  const { reset, dispatcher, dirty } = useDispatch();
  // const { name, age } = useSelector("info", { name: "Anonymous", age: 20 });
  const age = useSelector("info.age", 20);
  const name = useSelector("info.name", "Anonymous");
  console.log("🚀 ~ age:", age);
  const { lang } = useSelector("info2", { lang: "en" });

  const addAge = () => {
    dispatcher("setAge", { value: age + 1 });
    // dispatch({ age: age + 1 }, "info");
  };

  const addLang = () => {
    dispatcher("lang", { lang: "ar" });
  };

  return (
    <div className="flex-center flex-col gap-3 h-[calc(100vh-111px)]">
      <h1 className="h1">{name}</h1>
      <h1 className="h1">{age}</h1>
      <h1 className="h1">{lang}</h1>
      <h1 className="h1">StoreIt - A simple file storage service</h1>
      <UserData />
      <Button onClick={addAge}>add age</Button>
      <Button
        onClick={() => {
          reset("info.age");
        }}
      >
        reset Age
      </Button>
      <Button
        onClick={() => {
          reset("info.name");
        }}
      >
        reset name
      </Button>
      <Button
        onClick={() => {
          dirty("info.name");
        }}
      >
        dirty name
      </Button>
      <Button onClick={addLang}>add lang</Button>
    </div>
  );
}
