"use client";

import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import Text from "./ui/Text";
import { cn } from "@/lib/utils";
import { useSelector } from "zustore";

const ProfileBox = ({ toMobile = false }: { toMobile?: boolean }) => {
  const user = useSelector("user");
  return (
    <div
      className={cn(
        "mt-4 flex-center gap-2 lg:justify-start",
        "p-1 lg:p-3 rounded-full bg-brand/10 text-light-100",
        toMobile && "!justify-start"
      )}
    >
      {user?.avatar ? (
        <Image
          src={user?.avatar}
          width={44}
          height={44}
          alt=""
          className="w-10 rounded-full object-cover aspect-square"
        />
      ) : (
        <Skeleton className="w-10 rounded-full aspect-square" />
      )}

      <div
        className={cn(
          "hidden lg:flex flex-col gap-1 text-start",
          toMobile && "!flex"
        )}
      >
        {user?.fullName ? (
          <Text
            tooltip={user?.fullName}
            TriggerClass="subtitle-2 oneline-text capitalize lg:w-[160px] xl:w-[200px]"
          >
            {user?.fullName}
          </Text>
        ) : (
          <Skeleton className="lg:w-[160px] xl:w-[200px] h-4" />
        )}
        {user?.email ? (
          <Text
            tooltip={user?.email}
            TriggerClass="caption oneline-text lg:w-[160px] xl:w-[200px]"
          >
            {user?.email}
          </Text>
        ) : (
          <Skeleton className="lg:w-[160px] xl:w-[200px] h-4" />
        )}
      </div>
    </div>
  );
};

export default ProfileBox;
