"use client";

import { useEffect, useRef } from "react";
import { ExternalToast, toast } from "sonner";

const ClientToast = ({
  message,
  data,
}: {
  message: string | React.ReactNode;
  data?: ExternalToast;
}) => {
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current) {
      toast(message, data);
      hasShownToast.current = true;
    }
  }, [message]);

  return null;
};

export default ClientToast;
