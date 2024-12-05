"use client";

import { getCurrentUser } from "@/lib/actions/user.action";
import { useDispatch } from "@/store";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const UserData = async ({
  children,
  shouldAuth,
  redirectTo,
}: {
  children: ReactNode;
  shouldAuth: boolean;
  redirectTo: string;
}) => {
  const { dispatch } = useDispatch();

  const { error, ...currentUser } = (await getCurrentUser()) || {};

  dispatch({ user: currentUser });

  console.log("🚀 ~ layout ~ currentUser:", currentUser);
  console.log("🚀 ~ layout ~ error:", error);

  if (shouldAuth) redirect(redirectTo);
  return <>{children}</>;
};

export default UserData;
