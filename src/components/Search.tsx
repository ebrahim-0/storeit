"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.action";
import { Models } from "node-appwrite";
import { useDebouncedCallback } from "use-debounce";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import Icon from "./Icon";

const Search = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";

  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Models.Document[]>([]);
  const [searchQuery, setSearchQuery] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchFn = useDebouncedCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    const { error, ...files } = await getFiles({
      types: [],
      searchText: query,
    });

    setResults(files.documents || []);
    setIsLoading(false);

    if (error) {
      setError(error.message);
    }
  }, 500);

  useEffect(() => {
    if (searchQuery) {
      debouncedSearchFn(searchQuery);
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setResults([]);
    setOpen(false);
    setSearchQuery(file.name);
    debouncedSearchFn.cancel();

    push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${file.name}`,
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="flex h-[52px] w-full items-center gap-3 rounded-full px-4 shadow-drop-3 min-[850px]:w-[480px]"
          onClick={() => setOpen(true)}
        >
          <Icon id="search" className="!size-6" viewBox="0 0 20 20" />

          <p
            className={cn(
              "body-2 hidden truncate px-0 sm:block",
              !searchQuery && "text-light-200",
            )}
          >
            {searchQuery || "Search..."}
          </p>
        </div>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={20}
        align="start"
        className="relative h-[540px] w-[100vw] overflow-y-scroll rounded-2xl md:w-[480px]"
      >
        <div className="mb-3 flex h-[52px] items-center gap-3 rounded-full px-4 shadow-drop-3">
          <Icon id="search" className="!size-6" viewBox="0 0 20 20" />

          <Input
            value={searchQuery}
            fullWidth
            placeholder="Search..."
            className="no-focus body-2 border-0 px-0 shadow-none placeholder:text-light-200"
            onChange={(e) => {
              debouncedSearchFn.cancel();
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        <div className="flex w-full flex-col gap-3 p-4">
          {isLoading ? (
            <p className="body-2 text-center text-light-100">Loading...</p>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : results.length > 0 ? (
            results.map((file) => (
              <li
                className="flex items-center justify-between rounded-lg bg-light-400 p-2"
                key={file.$id}
                onClick={() => handleClickItem(file)}
              >
                <div className="flex w-[65%] cursor-pointer items-center gap-4">
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                    className="size-12 min-w-12 bg-transparent"
                    iconSize={32}
                  />

                  <p
                    style={{ wordBreak: "break-word" }}
                    className="subtitle-2 truncate p-3 text-light-100"
                  >
                    {file.name}
                  </p>
                </div>
                <FormattedDateTime
                  date={file.$createdAt}
                  className="caption w-[35%] text-light-200"
                />
              </li>
            ))
          ) : (
            <p className="body-2 text-center text-light-100">No files found</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Search;
