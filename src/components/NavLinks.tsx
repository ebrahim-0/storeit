"use client";

import { navLinks } from "@/constants";
import { useSelector } from "zustore";
import { isActive } from "@/lib/isActive";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = ({ classNames }: { classNames?: string }) => {
  const pathname = usePathname();
  const user = useSelector("user");

  return (
    <nav className={cn("hidden justify-end gap-3 md:flex", classNames)}>
      {navLinks(user?.email).map(({ title, path }, index) => {
        return (
          <Link
            key={index}
            href={path}
            className={cn(
              "rounded-md p-2 transition-all duration-300",
              isActive(pathname, path)
                ? "bg-brand text-white hover:bg-brand-100"
                : "text-brand",
            )}
          >
            {title}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
