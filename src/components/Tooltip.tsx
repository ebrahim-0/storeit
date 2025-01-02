"use client";

import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
  tooltip: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

const positionClasses = {
  top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
  left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
  right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
};

const arrowClasses = {
  top: "bottom-[-4px] left-1/2 transform -translate-x-1/2 border-t-gray-900",
  bottom: "top-[-4px] left-1/2 transform -translate-x-1/2 border-b-gray-900",
  left: "right-[-4px] top-1/2 transform -translate-y-1/2 border-l-gray-900",
  right: "left-[-4px] top-1/2 transform -translate-y-1/2 border-r-gray-900",
};

export function Tooltip({
  tooltip,
  children,
  position = "top",
  delay = 300,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showTooltip = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      <div
        ref={tooltipRef}
        className={`absolute z-10 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 ${
          positionClasses[position]
        } ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
        role="tooltip"
      >
        {tooltip}
        <div
          className={`absolute h-2 w-2 rotate-45 transform bg-gray-900 ${arrowClasses[position]}`}
        />
      </div>
    </div>
  );
}
