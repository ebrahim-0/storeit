"use client";

import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { sideBarLinks } from "@/constants";
import { isActive } from "@/lib/isActive";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ProfileBox from "./ProfileBox";
import { Separator } from "./ui/separator";
import Text from "./ui/Text";
import { useDispatch, useSelector } from "zustore";
import FileUploader from "./FileUploader";
import Search from "./Search";
import Icon from "./Icon";

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
          height={52}
          className="w-[150px] text-brand"
        />
      </Link>

      <div className="flex items-center gap-6">
        <Search />

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <Menu
              size="35"
              strokeWidth="3"
              className="block cursor-pointer md:hidden"
            />
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only"></SheetTitle>

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
                            className="block !size-6 cursor-pointer"
                            color={
                              isActive(pathname, path) ? "white" : "#a3b2c7"
                            }
                            width={26}
                            height={26}
                            viewBox="0 0 26 26"
                          />

                          {/* <Image
                            src={icon}
                            alt={title}
                            width={24}
                            height={24}
                            className={cn(
                              "w-6 opacity-25 invert filter",
                              isActive(pathname, path) &&
                                "opacity-100 invert-0",
                            )}
                          /> */}
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
                  )}
                  tooltip="Logout"
                  toolTipAlign="center"
                  toolTipClass="bg-brand/10 text-brand"
                >
                  <Icon
                    id="logout"
                    width={24}
                    height={24}
                    className="w-6 text-brand"
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
