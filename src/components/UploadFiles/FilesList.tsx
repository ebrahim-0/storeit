"use client";

import { Models } from "node-appwrite";
import Card from "@/components/Card";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "zustore";
import { useEffect } from "react";

export const FilesList = ({
  files,
}: {
  files: Models.DocumentList<Models.Document>;
}) => {
  const sortFiles = useSelector("sortFiles");
  const { dispatch } = useDispatch();

  useEffect(() => {
    dispatch(files, "files");
  }, [files]);

  const sortedFiles = sortFiles?.total > 0 ? sortFiles : files;

  return sortedFiles?.total > 0 ? (
    <section
      className={cn(
        "grid w-full grid-cols-1 gap-[26px]",
        "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      )}
    >
      {sortedFiles?.documents?.map((file: Models.Document) => (
        <Card key={`${file?.name}-${file.$id}`} file={file} />
      ))}
    </section>
  ) : (
    <p className="body-1 mt-10 text-center text-light-200">no files uploaded</p>
  );
};
