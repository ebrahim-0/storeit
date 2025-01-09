"use client";

import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import { useCallback } from "react";
import { useDispatch, useSelector } from "zustore";

const UploadingFiles = () => {
  const { dispatch } = useDispatch();

  const files = useSelector<File[]>("files", [] as File[]);

  const handleRemoveFile = useCallback(
    (fileName: string) => {
      const filterFiles = files.filter((f) => f.name === fileName);
      dispatch(filterFiles, "files");
    },
    [files],
  );

  return (
    <>
      {files.length > 0 && (
        <ul
          style={{ width: "-webkit-fill-available" }}
          className={cn(
            "fixed bottom-3 right-0 z-50 m-5 flex",
            "!h-fit flex-col gap-3 rounded-[20px] border",
            "bg-white p-7 shadow-drop-3 sm:bottom-10",
            "sm:right-10 sm:size-full sm:max-w-[480px]",
          )}
        >
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl p-3 shadow-drop-3"
              >
                <Thumbnail
                  type={type}
                  extension={extension}
                  url={convertFileToUrl(file)}
                />

                <div className="subtitle-2 oneline-text mb-2 w-full max-w-[280px] whitespace-nowrap">
                  {file.name}
                </div>
                <Image
                  src="/assets/icons/file-loader.gif"
                  width={80}
                  height={26}
                  alt="loader"
                />
                {/* 
                <Icon
                  id="remove"
                  size={24}
                  onClick={() => handleRemoveFile(file.name)}
                /> */}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default UploadingFiles;
