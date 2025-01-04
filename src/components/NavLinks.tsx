"use client";

import { navLinks } from "@/constants";
import { useSelector } from "zustore";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NavLinks = ({ classNames }: { classNames?: string }) => {
  const user = useSelector("user");

  return (
    <nav className={cn("hidden justify-end gap-3 md:flex", classNames)}>
      {navLinks(user?.email).map(({ title, path }, index) => {
        return (
          <Link
            key={index}
            href={path}
            className="rounded-md bg-brand px-4 py-2 font-semibold text-white"
          >
            {title}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
