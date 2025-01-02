import NavLinks from "@/components/NavLinks";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserData from "@/components/UserData";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="md:container">
      <header className="flex w-full items-center justify-between border-b p-3">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="Logo"
            width={100}
            height={82}
            className="w-[150px]"
          />
        </Link>

        <Sheet>
          <SheetTrigger>
            <Menu
              size="35"
              strokeWidth="3"
              className="block cursor-pointer md:hidden"
            />
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only"></SheetTitle>

            <NavLinks classNames="!flex flex-col py-8" />
          </SheetContent>
        </Sheet>
        <NavLinks />
      </header>
      <main className="min-h-[calc(100vh-111px)]">{children}</main>
    </div>
  );
};

export default layout;
