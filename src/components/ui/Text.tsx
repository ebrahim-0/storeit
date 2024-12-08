import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { ReactNode } from "react";

const Text = ({
  children,
  tooltip,
  delay = 100,
  TriggerClass,
  toolTipClass,
  toolTipAlign = "start",
  side = "top",
}: {
  children: ReactNode;
  tooltip?: string;
  delay?: number;
  TriggerClass?: string;
  toolTipClass?: string;
  toolTipAlign?: "center" | "end" | "start";
  side?: "top" | "right" | "bottom" | "left";
}) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "whitespace-nowrap rtl:text-end ltr:text-start",
            TriggerClass
          )}
        >
          {children}
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent
            align={toolTipAlign}
            side={side}
            className={cn("rtl:text-end ltr:text-start", toolTipClass)}
          >
            {tooltip}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default Text;
