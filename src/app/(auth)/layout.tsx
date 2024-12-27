import ClientToast from "@/components/ClientToast";
import { getCurrentUser } from "@/lib/actions/user.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

const layout = async ({ children }: { children: ReactNode }) => {
  const { error, ...currentUser } = await getCurrentUser();

  if (currentUser?.email) redirect("/");

  return (
    <div className="flex min-h-screen">
      {error && (
        <ClientToast
          key={error.message}
          message={<p className="body-2 text-white">{error?.message}</p>}
          data={{
            className: "!bg-red !rounded-[10px]",
          }}
        />
      )}
      <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Link href="/">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="Logo"
              width={223}
              height={82}
              className="h-auto"
            />
          </Link>

          <div className="space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              This is a place where you can store all your documents
            </p>
          </div>

          <Image
            src="/assets/icons/Illustration.svg"
            alt="Illustration"
            width={342}
            height={342}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <Link href="/" className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="Logo"
            width={224}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </Link>
        {children}
      </section>
    </div>
  );
};

export default layout;
