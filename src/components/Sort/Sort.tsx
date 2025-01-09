"use client";

import { sortTypes } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const Sort = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") || sortTypes[0].value;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleChange = (value: string) => {
    // push(`${pathname}?${createQueryString("sort", value)}`);
    push(`${pathname}?sort=${value}`);
  };

  return (
    <Select defaultValue={sort} onValueChange={handleChange}>
      <SelectTrigger className="no-focus h-11 w-full rounded-[8px] border-transparent bg-white !shadow-sm sm:w-[210px]">
        <SelectValue
          placeholder={sortTypes.find((type) => type.value === sort)?.label}
        />
      </SelectTrigger>
      <SelectContent className="!shadow-drop-3">
        {sortTypes.map((sortType) => (
          <SelectItem
            key={sortType.value}
            className="cursor-pointer"
            value={sortType.value}
          >
            {sortType.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
