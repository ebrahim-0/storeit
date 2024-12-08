"use client";

import { ReactNode } from "react";
import UserData from "./UserData";
import { initial } from "zustore";
import { initialState } from "@/lib/initialState";
import { createDispatch } from "@/lib/createDispatcher";

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
