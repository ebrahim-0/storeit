"use client";

import { ReactNode } from "react";
import { initial } from "zustore";
import { createDispatch } from "@/lib/createDispatch";
import { initialState } from "@/lib/initialState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const StateProvider = initial(initialState, createDispatch);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Root = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <StateProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </StateProvider>
  );
};

export default Root;
