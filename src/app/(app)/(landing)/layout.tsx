import Icon from "@/components/Icon";
import NavLinks from "@/components/NavLinks";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
          <Icon
            id="logo-full-brand"
            width={150}
            height={53}
            color="hsl(var(--brand-default))"
          />
        </Link>

        <Sheet>
          <SheetTrigger>
            <Icon
              id="menu"
              size={35}
              viewBox="0 0 22 22"
              color="hsl(var(--light-100))"
              className="block cursor-pointer md:hidden"
            />
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only" />

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
