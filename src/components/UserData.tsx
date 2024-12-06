"use client";

import { getCurrentUser } from "@/lib/actions/user.action";
import { useEffect } from "react";
import { useDispatch } from "zustate-add";

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
