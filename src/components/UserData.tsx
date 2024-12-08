"use client";

import { getCurrentUser } from "@/lib/actions/user.action";
import { useDispatch } from "zustore";
import { useEffect } from "react";

const UserData = () => {
  const { dispatch } = useDispatch();

  useEffect(() => {
    const getData = async () => {
      const { error, ...currentUser } = (await getCurrentUser()) || {};

      dispatch({ user: currentUser });

      console.log("🚀 ~ layout ~ currentUser:", currentUser);
      console.log("🚀 ~ layout ~ error:", error);
    };

    getData();
  }, []);

  return <></>;
};

export default UserData;
