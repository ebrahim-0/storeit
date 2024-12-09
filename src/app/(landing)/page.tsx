"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useDispatch, useSelector } from "zustore";

export default function Home() {
  const { reset, dispatcher, dirty } = useDispatch();
  const [{ name, age }, { lang }] = useSelector(
    ["info", "info2"],
    [{ name: "Anonymous", age: 20 }, { lang: "en" }]
  );
  // const { lang } = useSelector("info2", { lang: "en" });
  const info = useSelector("info");
  console.log("🚀 ~ Home ~ info:", info);

  useEffect(() => {
    console.log("🚀 ~ Home ~ age:", age);
  }, [age]);

  useEffect(() => {
    console.log("🚀 ~ Home ~ name:", name);
  }, [name]);

  const addAge = () => {
    dispatcher("setAge", { value: age + 1 });
    // dispatch({ age: age + 1 }, "info");
  };

  const addLang = () => {
    dispatcher("lang", { lang: "ar" });
  };

  const resetAge = () => {
    dirty("info.age");
  };
  const resetName = () => {
    reset("info.name");
  };
  const dirtyName = () => {
    reset("info.name");
  };

  return (
    <div className="flex-center flex-col gap-3 h-[calc(100vh-111px)]">
      <h1 className="h1">{name}</h1>
      <h1 className="h1">{age}</h1>
      <h1 className="h1">{lang}</h1>
      <h1 className="h1">StoreIt - A simple file storage service</h1>
      <Button onClick={addAge}>add age</Button>
      <Button onClick={resetAge}>reset Age</Button>
      <Button onClick={resetName}>reset name</Button>
      <Button onClick={dirtyName}>dirty name</Button>
      <Button onClick={addLang}>add lang</Button>
    </div>
  );
}
