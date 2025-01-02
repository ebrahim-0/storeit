// "use client";

// import { useEffect, useState } from "react";
// import { Input } from "./ui/input";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { getFiles } from "@/lib/actions/file.action";
// import { Models } from "node-appwrite";
// import { useDebounce, useDebouncedCallback } from "use-debounce";
// import Thumbnail from "./Thumbnail";
// import FormattedDateTime from "./FormattedDateTime";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// import Image from "next/image";
// import { cn } from "@/lib/utils";

// const Search = () => {
//   const { push } = useRouter();
//   const path = usePathname();
//   const searchParams = useSearchParams();

//   const query = searchParams.get("query") || "";

//   const [open, setOpen] = useState(false);
//   const [results, setResults] = useState<Models.Document[]>([]);
//   const [searchQuery, setSearchQuery] = useState(query);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [debouncedSearch] = useDebounce(searchQuery, 300);

//   const debouncedSearchFn = useDebouncedCallback(async (query: string) => {
//     if (debouncedSearch.length === 0) {
//       setResults([]);
//       return push(path.replace(searchParams.toString(), ""));
//     }

//     setIsLoading(true);
//     setError(null);

//     const { error, ...files } = await getFiles({
//       types: [],
//       searchText: query,
//     });

//     console.log("🚀 ~ debouncedSearchFn ~ error:", error);

//     setResults(files.documents || []);
//     setIsLoading(false);

//     if (error) {
//       setError(error.message);
//     }
//   }, 0);

//   useEffect(() => {
//     debouncedSearchFn(debouncedSearch);
//   }, [debouncedSearch]);

//   const handleClickItem = (file: Models.Document) => {
//     setResults([]);
//     setOpen(false);
//     setSearchQuery(file.name);
//     debouncedSearchFn.cancel();

//     push(
//       `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${file.name}`,
//     );
//   };

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <div className="mb-3 flex h-[52px] items-center gap-3 rounded-full px-4 shadow-drop-3 lg:w-[480px]">
//           <Image
//             src="/assets/icons/search.svg"
//             alt="Search"
//             width={24}
//             height={24}
//           />
//           <p
//             className={cn(
//               "body-2 hidden px-0 md:block",
//               !searchQuery && "text-light-200",
//             )}
//           >
//             {searchQuery || "Search..."}
//           </p>
//         </div>
//       </PopoverTrigger>

//       <PopoverContent
//         align="start"
//         className="relative h-[600px] w-full overflow-y-scroll rounded-2xl md:w-[480px]"
//       >
//         <div className="mb-3 flex h-[52px] flex-1 items-center gap-3 rounded-full px-4 shadow-drop-3">
//           <Image
//             src="/assets/icons/search.svg"
//             alt="Search"
//             width={24}
//             height={24}
//           />
//           <Input
//             value={searchQuery}
//             fullWidth
//             placeholder="Search..."
//             className="no-focus body-2 border-0 px-0 shadow-none placeholder:text-light-200"
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <div className="flex w-full flex-col gap-3 p-4">
//           {isLoading ? (
//             <p className="body-2 text-center text-light-100">Loading...</p>
//           ) : error ? (
//             <div className="text-red-500">{error}</div>
//           ) : results.length > 0 ? (
//             results.map((file) => (
//               <li
//                 className="flex items-center justify-between rounded-lg bg-light-400 p-2"
//                 key={file.$id}
//                 onClick={() => handleClickItem(file)}
//               >
//                 <div className="flex cursor-pointer items-center gap-4">
//                   <Thumbnail
//                     type={file.type}
//                     extension={file.extension}
//                     url={file.url}
//                     className="size-12 min-w-12"
//                   />
//                   <p className="subtitle-2 line-clamp-1 w-fit truncate text-light-100 md:w-[200px]">
//                     {file.name}
//                   </p>
//                 </div>

//                 <FormattedDateTime
//                   date={file.$createdAt}
//                   className="caption line-clamp-1 text-light-200"
//                 />
//               </li>
//             ))
//           ) : (
//             <p className="body-2 text-center text-light-100">No files found</p>
//           )}
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default Search;

"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.action";
import { Models } from "node-appwrite";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Image from "next/image";
import { cn } from "@/lib/utils";

const Search = () => {
  const { push } = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";

  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Models.Document[]>([]);
  const [searchQuery, setSearchQuery] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const debouncedSearchFn = useDebouncedCallback(async (query: string) => {
    if (debouncedSearch.length === 0) {
      setResults([]);
      return push(path.replace(searchParams.toString(), ""));
    }

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
  }, 0);

  useEffect(() => {
    debouncedSearchFn(debouncedSearch);
  }, [debouncedSearch]);

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
          className="mb-3 flex h-[52px] w-full items-center gap-3 rounded-full px-4 shadow-drop-3 lg:w-[480px]"
          onClick={() => setOpen(true)}
        >
          <Image
            src="/assets/icons/search.svg"
            alt="Search"
            width={24}
            height={24}
          />
          <p
            className={cn(
              "body-2 hidden px-0 sm:block",
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
        className="relative h-[400px] w-[100vw] overflow-y-scroll rounded-lg md:w-[480px]"
      >
        <div className="mb-3 flex h-[52px] items-center gap-3 rounded-full px-4 shadow-drop-3">
          <Image
            src="/assets/icons/search.svg"
            alt="Search"
            width={24}
            height={24}
          />
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
                    className="size-12 min-w-12"
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
