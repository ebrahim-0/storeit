"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import Search from "./Search";
import FileUploader from "./FileUploader";
import Text from "@/components/ui/Text";
import { useDispatch } from "zustore";

const Header = () => {
  const { dispatcher } = useDispatch();
  return (
    <header className="hidden items-center justify-between gap-5 p-5 sm:flex lg:py-7 xl:gap-10">
      <Search />
      <div className="flex-center min-w-fit gap-4 pr-2.5">
        <FileUploader accountId="" ownerId="" />
        <Text
          onClick={() => dispatcher("logoutUser")}
          side="bottom"
          TriggerClass={cn(
            "flex-center size-[54px] bg-brand/10 rounded-full",
            "shadow-none transition-all p-0 hover:bg-brand/20",
          )}
          tooltip="Logout"
          toolTipAlign="center"
          toolTipClass="bg-brand/10 text-brand"
        >
          <Image
            src="/assets/icons/logout.svg"
            alt="logout"
            width={24}
            height={24}
            className="w-6"
          />
        </Text>
      </div>
    </header>
  );
};

export default Header;
