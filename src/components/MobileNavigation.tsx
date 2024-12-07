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
import { useSelector } from "zustore";
import ProfileBox from "./ProfileBox";

const MobileNavigation = () => {
  const pathname = usePathname();
  const { fullName, email, avatar } = useSelector("user");

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="container flex sm:hidden w-full justify-between items-center p-3">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="Logo"
          width={100}
          height={82}
          className=" w-[150px]"
        />
      </Link>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Menu
            size="35"
            strokeWidth="3"
            className="block md:hidden cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent>
          <SheetTitle className="sr-only"></SheetTitle>

          <ProfileBox toMobile={true} />

          <nav className="h5 mt-6 gap-1 flex-1 text-brand">
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
                        "flex-center !justify-start h5 px-[30px] gap-4",
                        "rounded-[30px] h-[45px] w-full",
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
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
