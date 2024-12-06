"use client";

import { ReactNode } from "react";
import { CreateDispatchType, StateProvider, setConfig } from "zustate-add";

setConfig({ debug: process.env.NODE_ENV === "development" });

const userGlobalState = {
  counter: 50,
  user: null,
  info: {
    age: 22,
  },
};

const createDispatch: CreateDispatchType = (data, tools, actions) => {
  const { type, payload } = data;
  const { update /*, addState , reset, dirty */ } = tools;

  console.log("render");

  const setAge = () => {
    const age = payload.value;
    update({ age }, "info");
  };

  const lang = () => {
    const { lang } = payload;
    update({ lang }, "info2");
  };

  switch (!!type) {
    /*
      actions => return all actions that you logged
      when you call dispatch("setAge", { value: 28 })
      (setAge) is the action
    */
    case !!actions.setAge:
      return setAge();
    case !!actions.lang:
      return lang();
    default:
      console.log("no actions");
      break;
  }
};

const Root = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <StateProvider
      globalState={userGlobalState}
      createDispatch={createDispatch}
    >
      {children}
    </StateProvider>
  );
};

export default Root;
