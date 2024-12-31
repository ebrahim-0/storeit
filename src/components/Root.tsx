"use client";

import { ReactNode } from "react";
import { initial } from "zustore";
import { createDispatch } from "@/lib/createDispatch";
import { initialState } from "@/lib/initialState";
import UserData from "./UserData";

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
