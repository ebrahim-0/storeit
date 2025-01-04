"use client";

import { Models } from "node-appwrite";
import Card from "./Card";
import { cn } from "@/lib/utils";

const FilesList = ({
  files,
}: {
  files: Models.DocumentList<Models.Document>;
}) => {
  const isGrid = true;

  return (
    <>
      {files?.total > 0 ? (
        <section
          className={cn(
            "grid w-full grid-cols-1 gap-[26px] sm:grid-cols-2",
            isGrid && "lg:grid-cols-3 xl:grid-cols-4",
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
    </>
  );
};

export default FilesList;
