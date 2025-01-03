"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { ReactNode, RefAttributes } from "react";
import { ClassValue } from "clsx";

import { TooltipTriggerProps } from "@radix-ui/react-tooltip";

const Text = ({
  children,
  tooltip,
  delay = 100,
  toolTipClass,
  toolTipAlign = "start",
  side = "top",
  ...props
}: {
  children: ReactNode;
  tooltip?: string;
  delay?: number;
  toolTipClass?: ClassValue;
  toolTipAlign?: "center" | "end" | "start";
  side?: "top" | "right" | "bottom" | "left";
} & TooltipTriggerProps &
  RefAttributes<HTMLButtonElement>) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger
          {...props}
          className={cn(
            "whitespace-nowrap ltr:text-start rtl:text-end",
            props.className,
          )}
        >
          {children}
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent
            align={toolTipAlign}
            side={side}
            className={cn(
              "max-w-[250px] ltr:text-start rtl:text-end",
              toolTipClass,
            )}
          >
            {tooltip}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default Text;
