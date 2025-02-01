import Icon from "@/components/Icon";
import Link from "next/link";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

const layout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="flex flex-1 flex-col items-center bg-transparent p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <Link href="/" className="mb-16">
          <Icon
            id="logo-full"
            width={224}
            height={82}
            color="hsl(var(--brand-default))"
            aria-label="Go to homepage"
            tabIndex={0}
          />
        </Link>
        {children}
      </section>
    </div>
  );
};

export default layout;
