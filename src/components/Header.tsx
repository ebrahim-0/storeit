import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { logout } from "@/lib/actions/user.action";

const Header = () => {
  return (
    <header className="hidden items-center justify-between gap-5 p-5 sm:flex lg:py-7 xl:gap-10">
      <Search />
      <div className="flex-center min-w-fit gap-4 pr-2.5">
        <FileUploader />
        <form action={logout}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                type="submit"
                className={cn(
                  "flex-center p-0",
                  "size-[54px] rounded-full bg-brand/10",
                  "shadow-none transition-all hover:bg-brand/20"
                )}
              >
                <Image
                  src="/assets/icons/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                  className="w-6"
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-brand/10 text-brand">
                Logout
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </div>
    </header>
  );
};

export default Header;
