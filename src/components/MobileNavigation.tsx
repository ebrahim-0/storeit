"use client";

import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { sideBarLinks } from "@/constants";
import { isActive } from "@/lib/isActive";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { IUser } from "@/types";

const MobileNavigation = ({ fullName, email, avatar }: IUser) => {
  const pathname = usePathname();

  return (
    <div className="container">
      <header className="flex w-full justify-between items-center p-3">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="Logo"
            width={100}
            height={82}
            className=" w-[150px]"
          />
        </Link>

        <Sheet>
          <SheetTrigger>
            <Menu
              size="35"
              strokeWidth="3"
              className="block md:hidden cursor-pointer"
            />
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only"></SheetTitle>

            <nav className="h5 mt-6 gap-1 flex-1 text-brand">
              <ul className="flex flex-1 flex-col gap-6">
                {sideBarLinks.map(({ title, path, icon }, index) => {
                  return (
                    <Link href={path} key={index} className="lg:w-full">
                      <li
                        className={cn(
                          "flex-center !justify-start h5 px-[30px] gap-4",
                          "rounded-xl lg:rounded-[30px] h-[45px] lg:w-full",
                          isActive(pathname, path)
                            ? "bg-brand text-white shadow-drop-2"
                            : "text-light-100"
                        )}
                      >
                        <Image
                          src={icon}
                          alt={title}
                          width={24}
                          height={24}
                          className={cn(
                            "w-6 filter invert opacity-25",
                            isActive(pathname, path) && "invert-0 opacity-100"
                          )}
                        />
                        <p>{title}</p>
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </nav>

            <div>
              <div className="relative hidden lg:block h-[235px]">
                <Image
                  src="/assets/icons/Illustration.svg"
                  alt="Illustration badge"
                  width={195}
                  height={174}
                  className="mx-auto"
                />
                <div className="absolute -z-10 top-[92px] rounded-[30px] bg-brand/10 w-full h-[142px]" />
              </div>
            </div>

            <div className="mt-4 flex-center gap-2 !justify-start p-2 rounded-full bg-brand/10 text-light-100">
              <Image
                src={avatar}
                width={44}
                height={44}
                alt=""
                className="w-10 rounded-full object-cover aspect-square"
              />

              <div>
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
};

export default MobileNavigation;
