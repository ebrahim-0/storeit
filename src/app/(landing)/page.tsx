"use client";

import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "zustore";

export default function Home() {
  const { reset, dispatcher, dirty, ApiCall, dispatch } = useDispatch();
  const [{ name, age }, { lang }] = useSelector(
    ["info", "info2"],
    [{ name: "Anonymous", age: 20 }, { lang: "en" }]
  );

  const [user] = useSelector(["user"]);

  const addAge = () => {
    dispatcher("setAge", { value: age + 1 });
    // dispatch({ age: age + 1 }, "info");
    console.log("🚀 ~ addAge ~ age:", age);
  };

  const getTodos = async () => {
    ApiCall(async ({ state, addState }) => {
      console.log("🚀 ~ ApiCall ~ state:", state);
      const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      const data = await res.json();
      console.log("🚀 ~ file: page.tsx ~ line 42 ~ getTodos ~ data", data);

      addState({ data }, "todos");
      return data;
    });
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
    dirty("info.name");
  };
  const dirtyLang = () => {
    reset("info2.lang");
  };

  return (
    <div className="flex-center flex-col gap-3 h-[calc(100vh-111px)]">
      <h1 className="h1">{user?.email}</h1>
      <h1 className="h1">{name}</h1>
      <h1 className="h1">{age}</h1>
      <h1 className="h1">{lang}</h1>
      <h1 className="h1">StoreIt - A simple file storage service</h1>
      <Button onClick={getTodos}>Call Api</Button>
      <Button onClick={addAge}>add age</Button>
      <Button onClick={resetAge}>reset Age</Button>
      <Button onClick={resetName}>reset name</Button>
      <Button onClick={dirtyName}>dirty name</Button>
      <Button onClick={dirtyLang}>dirty lang</Button>
      <Button onClick={addLang}>add lang</Button>
    </div>
  );
}
