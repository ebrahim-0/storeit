"use client";

import { cn } from "@/lib/utils";
import Search from "./Search";
import FileUploader from "./FileUploader";
import Text from "@/components/ui/Text";
import { useDispatch, useSelector } from "zustore";
import Icon from "./Icon";

const Header = () => {
  const { dispatcher } = useDispatch();
  const user = useSelector<IUser>("user");

  return (
    <header className="hidden items-center justify-between gap-5 p-4 sm:flex xl:gap-10">
      <Search />
      <div className="flex-center min-w-fit gap-4 pr-2.5">
        <FileUploader accountId={user?.accountId} ownerId={user?.$id} />
        <Text
          onClick={() => dispatcher("logoutUser")}
          side="bottom"
          className={cn(
            "flex-center bg-brand/10 size-[54px] rounded-full",
            "hover:bg-brand/20 p-0 shadow-none transition-all",
          )}
          tooltip="Logout"
          toolTipAlign="center"
          toolTipClass="bg-brand/10 text-brand"
        >
          <Icon id="logout" width={24} height={24} className="w-6 text-brand" />
        </Text>
      </div>
    </header>
  );
};

export default Header;
