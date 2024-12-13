"use client";

import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import Text from "./ui/Text";
import { cn } from "@/lib/utils";
import { useSelector } from "zustore";
import { Separator } from "./ui/separator";

const ProfileBox = ({ toMobile = false }: { toMobile?: boolean }) => {
  const user = useSelector("user");
  return (
    <div
      className={cn(
        "flex-center mt-4 w-full gap-2 lg:justify-start",
        "rounded-full bg-brand/10 p-1 text-light-100 lg:p-2",
        toMobile && "!justify-start",
      )}
    >
      {user?.avatar ? (
        <Image
          src={user?.avatar}
          width={44}
          height={44}
          alt=""
          className="aspect-square w-10 rounded-full object-cover"
        />
      ) : (
        <Skeleton className="aspect-square w-10 rounded-full" />
      )}

      <div
        className={cn(
          "hidden text-start leading-3 lg:block",
          toMobile && "!block",
        )}
      >
        {user?.fullName ? (
          <Text
            tooltip={user?.fullName}
            className="subtitle-2 oneline-text capitalize lg:w-[160px] xl:w-[200px]"
          >
            {user?.fullName}
          </Text>
        ) : (
          <Skeleton className="h-4 lg:w-[160px] xl:w-[200px]" />
        )}
        <Separator className="w-full bg-transparent" />
        {user?.email ? (
          <Text
            tooltip={user?.email}
            className="caption oneline-text lg:w-[160px] xl:w-[200px]"
          >
            {user?.email}
          </Text>
        ) : (
          <Skeleton className="h-4 lg:w-[160px] xl:w-[200px]" />
        )}
      </div>
    </div>
  );
};

export default ProfileBox;
