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
import { useCallback, useMemo, useState } from "react";
import Text from "../ui/Text";
import { useDispatch, useSelector } from "zustore";
import { sortFilesBy } from "@/lib/utils";

export const SortArrow = () => {
  const { dispatch, addState } = useDispatch();
  const files = useSelector("files");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || `${sortBy[0].value}-desc`;

  const [currentSortType, currentOrder] = useMemo(
    () => currentSort.split("-"),
    [currentSort],
  );

  const [asc, setAsc] = useState(currentOrder === "asc");
  const [sort, setSort] = useState(currentSortType);

  // const asc = currentOrder === "asc";

  const updateQueryString = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams as any);
      params.set(key, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleSortChange = (value: string) => {
    setSort(value);
    const queryString = updateQueryString(
      "sort",
      `${value}-${asc ? "asc" : "desc"}`,
    );

    const sortedFiles = sortFilesBy(files, `${value}-${asc ? "asc" : "desc"}`);

    addState({ mainLoading: true });
    dispatch(sortedFiles, "sortFiles");
    router.replace(`${pathname}?${queryString}`);
  };

  const toggleSortOrder = () => {
    const queryString = updateQueryString(
      "sort",
      `${sort}-${asc ? "desc" : "asc"}`,
    );

    setAsc((prev) => !prev);

    const sortedFiles = sortFilesBy(
      files,
      `${currentSortType}-${asc ? "desc" : "asc"}`,
    );

    addState({ mainLoading: true });
    dispatch(sortedFiles, "sortFiles");

    router.replace(`${pathname}?${queryString}`);
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
          className={`transform cursor-pointer text-dark-200 transition-transform duration-300 ${
            asc ? "rotate-180" : ""
          }`}
          onClick={toggleSortOrder}
          width={22}
          height={22}
          viewBox="0 0 18 18"
        />
      </Text>
    </div>
  );
};
