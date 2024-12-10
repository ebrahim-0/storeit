"use client";

import { useDispatch } from "zustore";
import { useEffect } from "react";

const UserData = () => {
  const { dispatcher } = useDispatch();

  useEffect(() => {
    dispatcher("getLoginUser");
  }, []);

  return <></>;
};

export default UserData;
