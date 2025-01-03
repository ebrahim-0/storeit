"use client";

import { sideBarLinks } from "@/constants";
import { isActive } from "@/lib/isActive";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileBox from "./ProfileBox";
import Icon from "./Icon";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="remove-scrollbar hidden h-screen w-[90px] flex-col overflow-auto px-5 py-5 sm:flex lg:w-[280px] xl:w-[325px]">
      <Link href="/">
        <Icon
          id="logo-full-brand"
          width={100}
          height={53}
          className="hidden w-[150px] text-brand lg:block"
        />

        <Icon
          id="logo-brand"
          width={60}
          height={52}
          className="h-auto text-brand lg:hidden"
        />
      </Link>

      <nav className="h5 mt-6 flex-1 gap-1 text-brand">
        <ul className="flex flex-1 flex-col gap-6">
          {sideBarLinks.map(({ title, path, icon }, index) => {
            return (
              <Link href={path} key={index} className="lg:w-full">
                <li
                  className={cn(
                    "flex-center h5 gap-4 lg:!justify-start lg:px-[30px]",
                    "h-[45px] rounded-xl lg:w-full lg:rounded-[30px]",
                    isActive(pathname, path)
                      ? "bg-brand text-white shadow-drop-2"
                      : "text-light-100",
                  )}
                >
                  <Icon
                    id={icon}
                    className="block !size-6 cursor-pointer"
                    color={isActive(pathname, path) ? "white" : "#a3b2c7"}
                    width={26}
                    height={26}
                    viewBox="0 0 26 26"
                  />

                  <p className="hidden lg:block">{title}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>

      <div>
        <div className="relative hidden h-[235px] lg:block">
          <Icon
            id="Illustration"
            width={195}
            height={195}
            viewBox="0 0 342 342"
            className="mx-auto"
          />

          <div className="absolute top-[92px] -z-10 h-[142px] w-full rounded-[30px] bg-brand/10" />
        </div>
      </div>

      <ProfileBox />
    </aside>
  );
};

export default Sidebar;
