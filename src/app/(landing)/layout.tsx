import NavLinks from "@/components/NavLinks";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCurrentUser } from "@/lib/actions/user.action";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { error, ...currentUser } = await getCurrentUser();
  console.log("🚀 ~ layout ~ currentUser:", currentUser);
  console.log("🚀 ~ layout ~ error:", error);

  return (
    <div className="container">
      <header className="flex w-full justify-between items-center p-3 border-b">
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

            <NavLinks
              isLogin={!!currentUser.email}
              classNames="!flex flex-col py-8"
            />
          </SheetContent>
        </Sheet>
        <NavLinks isLogin={!!currentUser.email} />
      </header>
      <main className="min-h-[calc(100vh-111px)]">{children} </main>
    </div>
  );
};

export default layout;
