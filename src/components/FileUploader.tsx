"use client";

import { cn, getFileType } from "@/lib/utils";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log("🚀 ~ onDrop ~ acceptedFiles:", acceptedFiles);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={cn("cursor-pointer", className)}>
      <input {...getInputProps()} />

      <Button
        type="button"
        className={cn(
          "flex-center h5 gap-2 lg:justify-start lg:px-[30px]",
          "h-[45px] rounded-xl lg:w-full lg:rounded-[30px]",
          "cursor-pointer bg-brand text-white shadow-drop-2",
        )}
      >
        <Image
          src="/assets/icons/upload.svg"
          width={24}
          height={24}
          alt="upload icon"
        />
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul
          style={{ width: "-webkit-fill-available" }}
          className={cn(
            "fixed bottom-3 right-0 z-10 m-5 border bg-white p-7 sm:bottom-10 sm:right-10 sm:size-full",
            "flex !h-fit flex-col gap-3 rounded-[20px] shadow-drop-3 sm:max-w-[480px]",
          )}
        >
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl p-3 shadow-drop-3"
              >
                test
              </li>
            );
          })}
        </ul>
      )}

      {isDragActive ? <p>Drop the files here ...</p> : <p>Upload</p>}
    </div>
  );
};

export default FileUploader;
