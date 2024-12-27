"use client";

import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import { MouseEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { uploadFile } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const FileUploader = ({ ownerId, accountId, className }: FileUploaderProps) => {
  const pathname = usePathname();

  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles((prev) => {
        const existingFileNames = new Set(prev.map((file) => file.name));
        const newFiles: File[] = [];

        acceptedFiles.forEach((file) => {
          if (existingFileNames.has(file.name)) {
            toast(
              <p>
                <span className="font-semibold">{`"${file.name}"`}</span> is
                already uploaded.
              </p>,
              {
                className: "!bg-red !rounded-[10px]",
                duration: 1500,
              },
            );
          } else {
            newFiles.push(file);
          }
        });
        return [...prev, ...newFiles];
      });

      const uploadPromises = acceptedFiles.map((file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prev) => prev.filter((f) => f.name !== file.name));

          return toast(
            <p className="flex items-center gap-3">
              <span>
                <span className="font-semibold">{`${file.name}`}</span> is too
                larger. Max size is 50MB.
              </span>
            </p>,
            {
              className: "!bg-red !rounded-[10px]",
              duration: 1500,
            },
          );
        }

        return uploadFile({ file, ownerId, accountId, path: pathname }).then(
          (uploadedFile) => {
            if (!uploadedFile?.error) {
              setFiles((prev) => prev.filter((f) => f.name !== file.name));
              return toast(
                <p className="flex items-center gap-3">
                  <span>
                    <span className="font-semibold">{`${file.name}`}</span> is
                    uploaded.
                  </span>
                </p>,
                {
                  className: "!bg-green !rounded-[10px]",
                  duration: 1500,
                },
              );
            } else {
              setFiles((prev) => prev.filter((f) => f.name !== file.name));

              return toast(uploadedFile?.error?.message, {
                className: "!bg-red !rounded-[10px]",
                duration: 1500,
              });
            }
          },
        );
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, pathname, files],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = useCallback(
    (e: MouseEvent<HTMLImageElement>, fileName: string) => {
      e.stopPropagation();

      setFiles((prev) => prev.filter((file) => file.name !== fileName));
    },
    [],
  );

  return (
    <>
      <div {...getRootProps()} className={cn("cursor-pointer", className)}>
        <input {...getInputProps()} />

        <Button
          type="button"
          className={cn(
            "flex-center h5 gap-2 lg:justify-start lg:px-[30px]",
            "h-[45px] w-full rounded-[30px] lg:w-full",
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
      </div>

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

                {/* <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                /> */}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default FileUploader;
