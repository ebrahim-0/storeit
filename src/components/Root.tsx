"use client";

import { ReactNode } from "react";
import UserData from "./UserData";
import { initial, CreateDispatchType } from "zustore";

export const initialState = {
  counter: 50,
  user: null,
  info: {
    name: "Ibrahim",
  },
};

export const createDispatch: CreateDispatchType = (name, payload, tools) => {
  const { dispatch, addState, reset } = tools;

  // Action functions
  const setAge = () => {
    const age = payload.value;
    dispatch({ age }, "info"); // Example of using addState
  };

  const lang = () => {
    const { lang } = payload;
    addState({ lang }, "info2"); // Example of using addState
  };

  // Switch based on the function name
  switch (name) {
    case "setAge":
      return setAge();
    case "lang":
      return lang();
    default:
      console.log("No matching action for:", name);
      break;
  }
};

const StateProvider = initial(initialState, createDispatch);

const Root = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <StateProvider>
      <UserData />
      {children}
    </StateProvider>
  );
};

export default Root;
