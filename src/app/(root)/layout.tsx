import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

const layout = async ({ children }: { children: ReactNode }) => {
  const { error, ...currentUser } = await getCurrentUser();
  console.log("🚀 ~ currentUser:", currentUser);
  console.log("🚀 ~ error:", error);

  if (!currentUser?.email || !!error) redirect("/login");

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex flex-col h-full flex-1">
        <MobileNavigation />
        <Header />
        <div className="remove-scrollbar overflow-auto h-full flex-1 bg-light-400 px-5 py-7 sm:mr-7 sm:rounded-[30px] md:mb-7 md:px-9 md:py-10">
          {children}
        </div>
      </section>
    </main>
  );
};

export default layout;
