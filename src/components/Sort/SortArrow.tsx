"use client";

import { sortBy } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Icon from "../Icon";
import { useCallback, useMemo } from "react";
import Text from "../ui/Text";

export const SortArrow = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || `${sortBy[0].value}-desc`;

  const [currentSortType, currentOrder] = useMemo(
    () => currentSort.split("-"),
    [currentSort],
  );

  const asc = currentOrder === "asc";

  const updateQueryString = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams as any);
      params.set(key, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleSortChange = (value: string) => {
    const queryString = updateQueryString(
      "sort",
      `${value}-${asc ? "asc" : "desc"}`,
    );
    router.push(`${pathname}?${queryString}`);
  };

  const toggleSortOrder = () => {
    const queryString = updateQueryString(
      "sort",
      `${currentSortType}-${asc ? "desc" : "asc"}`,
    );
    router.push(`${pathname}?${queryString}`);
  };

  return (
    <div className="flex items-center">
      <Select defaultValue={currentSortType} onValueChange={handleSortChange}>
        <SelectTrigger
          showIcon={false}
          className="no-focus subtitle-2 h-11 w-full rounded-[8px] border-transparent bg-transparent !shadow-none"
        >
          <SelectValue
            placeholder={
              sortBy.find((type) => type.value === currentSortType)?.label
            }
          />
        </SelectTrigger>
        <SelectContent className="!shadow-drop-3">
          {sortBy.map((sortType) => (
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
      <Text
        tooltip={
          "Sort By " +
          sortBy.find((type) => type.value === currentSortType)?.[
            asc ? "asc" : "desc"
          ]
        }
        side="bottom"
        align="center"
      >
        <Icon
          id="arrow"
          className={`transform cursor-pointer text-dark-200 ${
            asc ? "rotate-180" : ""
          }`}
          onClick={toggleSortOrder}
          width="22"
          height="22"
          viewBox="0 0 18 18"
        />
      </Text>
    </div>
  );
};
