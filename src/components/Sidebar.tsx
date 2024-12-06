"use client";

import { sideBarLinks } from "@/constants";
import { isActive } from "@/lib/isActive";
import { cn } from "@/lib/utils";
import { IUser } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "zustate-add";

const Sidebar = ({ fullName, email, avatar }: IUser) => {
  const user = useSelector("user");
  console.log("🚀 ~ Sidebar ~ user:", user);

  const pathname = usePathname();

  return (
    <aside className="remove-scrollbar hidden h-screen w-[90px] flex-col overflow-auto px-5 py-5 sm:flex lg:w-[280px] xl:w-[325px]">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="Logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />

        <Image
          src="/assets/icons/logo-brand.svg"
          alt="Logo"
          width={52}
          height={52}
          className="h-auto lg:hidden"
        />
      </Link>

      <nav className="h5 mt-6 gap-1 flex-1 text-brand">
        <ul className="flex flex-1 flex-col gap-6">
          {sideBarLinks.map(({ title, path, icon }, index) => {
            return (
              <Link href={path} key={index} className="lg:w-full">
                <li
                  className={cn(
                    "flex-center lg:justify-start h5 lg:px-[30px] gap-4",
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
                  <p className="hidden lg:block">{title}</p>
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

      <div className="mt-4 flex-center gap-2 lg:justify-start p-1 lg:p-3 rounded-full bg-brand/10 text-light-100">
        <Image
          src={avatar}
          width={44}
          height={44}
          alt=""
          className="w-10 rounded-full object-cover aspect-square"
        />

        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
