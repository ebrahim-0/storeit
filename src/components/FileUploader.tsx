"use client";

import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { MAX_FILE_SIZE } from "@/constants";
import { uploadFile } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Icon from "./Icon";
import { useDispatch, useSelector } from "zustore";

const FileUploader = ({ ownerId, accountId, className }: FileUploaderProps) => {
  const pathname = usePathname();
  const { dispatch } = useDispatch();

  const files = useSelector<File[]>("files", [] as File[]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const existingFileNames = new Set(files.map((file) => file.name));
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

      const allFiles = [...files, ...newFiles];

      dispatch(allFiles, "files");

      const uploadPromises = acceptedFiles.map((file) => {
        if (file.size > MAX_FILE_SIZE) {
          const filterFiles = files.filter((f) => f.name !== file.name);
          dispatch(filterFiles, "files");

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
              const filterFiles = files.filter((f) => f.name !== file.name);
              dispatch(filterFiles, "files");

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
              const filterFiles = files.filter((f) => f.name !== file.name);
              dispatch(filterFiles, "files");

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

  return (
    <>
      <div {...getRootProps()} className={cn("cursor-pointer", className)}>
        <input {...getInputProps()} />

        <Button
          type="button"
          className="btn flex-center h5 h-[45px] w-full gap-2 shadow-drop-2 lg:justify-between"
        >
          <Icon
            id="upload"
            className="block !size-6 cursor-pointer"
            viewBox="0 0 21 21"
          />

          <p>Upload</p>
        </Button>
      </div>
    </>
  );
};

export default FileUploader;
