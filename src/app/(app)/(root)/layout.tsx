import { ReactNode } from "react";
import { Metadata } from "next";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt is a simple file storage service.",
};

const layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation />
        <Header />
        <div className="remove-scrollbar h-full flex-1 overflow-auto bg-light-400 px-5 py-7 sm:mr-7 sm:rounded-[30px] md:mb-7 md:px-9 md:py-10">
          {children}
        </div>
      </section>
    </main>
  );
};

export default layout;
