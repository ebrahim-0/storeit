import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

export const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop();
  let type = "";

  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      type = "image";
      break;
    case "mp4":
    case "mkv":
    case "avi":
      type = "video";
      break;
    case "mp3":
    case "wav":
      type = "audio";
      break;
    case "pdf":
      type = "document";
      break;
    case "txt":
      type = "text";
      break;
    default:
      type = "unknown";
  }

  return { type, extension };
};
