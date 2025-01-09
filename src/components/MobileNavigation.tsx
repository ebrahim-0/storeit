"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { sideBarLinks } from "@/constants";
import { isActive } from "@/lib/isActive";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ProfileBox from "./ProfileBox";
import { Separator } from "./ui/separator";
import Text from "./ui/Text";
import { useDispatch, useSelector } from "zustore";
import Search from "./Search";
import Icon from "./Icon";
import { FileUploader } from "./UploadFiles";

const MobileNavigation = () => {
  const pathname = usePathname();
  const { dispatcher } = useDispatch();
  const user = useSelector<IUser>("user");

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="container flex w-full items-center justify-between p-3 sm:hidden">
      <Link href="/">
        <Icon
          id="logo-full-brand"
          width={150}
          height={52}
          color="hsl(var(--brand-default))"
        />
      </Link>

      <div className="flex items-center gap-6">
        <Search />

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <Icon
              id="menu"
              width={35}
              height={35}
              viewBox="0 0 22 22"
              color="hsl(var(--light-100))"
              className="block cursor-pointer md:hidden"
            />
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only" />

            <div className="flex h-full flex-col">
              <ProfileBox toMobile={true} />

              <Separator className="my-5 bg-light-200/20" />

              <nav className="h5 mt-6 flex-1 gap-1 text-brand">
                <ul className="flex flex-1 flex-col gap-6">
                  {sideBarLinks.map(({ title, path, icon }, index) => {
                    return (
                      <Link
                        href={path}
                        key={index}
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      >
                        <li
                          className={cn(
                            "flex-center h5 !justify-start gap-4 px-[30px]",
                            "h-[45px] w-full rounded-[30px]",
                            isActive(pathname, path)
                              ? "bg-brand text-white shadow-drop-2"
                              : "text-light-100",
                          )}
                        >
                          <Icon
                            id={icon}
                            className="block cursor-pointer"
                            color={
                              isActive(pathname, path)
                                ? "white"
                                : "hsl(var(--brand-100)/0.3)"
                            }
                            width={26}
                            height={26}
                          />

                          <p>{title}</p>
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </nav>

              <Separator className="my-5 bg-light-200/20" />
              <div className="flex flex-col justify-between gap-5 pb-5">
                <FileUploader accountId={user?.accountId} ownerId={user?.$id} />

                <Text
                  onClick={() => dispatcher("logoutUser")}
                  side="bottom"
                  className={cn(
                    "flex-center h-[54px] w-full rounded-full bg-brand/10",
                    "p-0 shadow-none transition-all hover:bg-brand/20",
                    "text-brand-100",
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
                    className="mr-2"
                  />
                  Logout
                </Text>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MobileNavigation;
