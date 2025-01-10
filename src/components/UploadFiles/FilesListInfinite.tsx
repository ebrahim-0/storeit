"use client";

import { Models } from "node-appwrite";
import Card from "@/components/Card";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFiles } from "@/lib/actions/file.action";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

export const FilesListInfinite = ({
  types,
  searchText,
  sort,
  limit,
}: {
  types: FileType[];
  searchText: string;
  sort: string;
  limit: number;
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["files", types, searchText, sort, limit],
      queryFn: async ({ pageParam = 0 }) => {
        const { error, ...files } = await getFiles({
          types,
          searchText,
          sort,
          limit: limit,
          offset: pageParam,
        });

        if (error) {
          throw new Error(error.message);
        }

        return files;
      },
      getNextPageParam: (lastPage) => {
        return lastPage?.documents?.length === limit
          ? lastPage?.documents?.length
          : null;
      },
      initialPageParam: 0,
    });

  const files = data?.pages?.reduce(
    (acc, page) => {
      return {
        total: acc.total + page.total,
        documents: [...acc.documents, ...page.documents],
      };
    },
    { total: 0, documents: [] },
  );

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader size={80} />
      </div>
    );

  return (
    <>
      {files?.total > 0 ? (
        <section
          className={cn(
            "grid w-full grid-cols-1 gap-[26px]",
            "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {files?.documents?.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="body-1 mt-10 text-center text-light-200">
          no files uploaded
        </p>
      )}

      {hasNextPage && (
        <Button
          variant="brand"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading more..." : "Load more"}
        </Button>
      )}
    </>
  );
};
