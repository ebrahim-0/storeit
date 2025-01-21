"use client";

import { cn } from "@/lib/utils";
import Search from "./Search";
import Text from "@/components/ui/Text";
import { useDispatch, useSelector } from "zustore";
import Icon from "./Icon";
import { FileUploader } from "./UploadFiles";
import { Progress } from "./ui/progress";

const Header = () => {
  const { dispatcher } = useDispatch();
  const [user, isLoading] = useSelector<[IUser, Boolean]>([
    "user",
    "mainLoading",
  ]);

  return (
    <header className="hidden items-center justify-between gap-5 p-4 sm:flex xl:gap-10">
      {isLoading && (
        <Progress
          className="fixed left-0 top-0 h-1 w-full !rounded-none"
          indeterminate
        />
      )}
      <Search />
      <div className="flex-center min-w-fit gap-4 pr-2.5">
        <FileUploader accountId={user?.accountId} ownerId={user?.$id} />
        <Text
          onClick={() => dispatcher("logoutUser")}
          side="bottom"
          className={cn(
            "flex-center size-[54px] rounded-full bg-brand/10",
            "p-0 shadow-none transition-all hover:bg-brand/20",
          )}
          tooltip="Logout"
          align="center"
          toolTipClass="bg-brand/10 text-brand"
        >
          <Icon
            id="logout"
            width={24}
            height={24}
            color="hsl(var(--brand-default))"
          />
        </Text>
      </div>
    </header>
  );
};

export default Header;
