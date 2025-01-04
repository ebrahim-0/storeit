import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { appwriteConfig } from "./config";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

export const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) return { type: "other", extension: "" };

  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "txt",
    "xls",
    "xlsx",
    "csv",
    "rtf",
    "ods",
    "ppt",
    "odp",
    "md",
    "html",
    "htm",
    "epub",
    "pages",
    "fig",
    "psd",
    "ai",
    "indd",
    "xd",
    "sketch",
    "afdesign",
    "afphoto",
    "afphoto",
  ];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];
  const audioExtensions = ["mp3", "wav", "ogg", "flac"];

  if (documentExtensions.includes(extension))
    return { type: "document", extension };
  if (imageExtensions.includes(extension)) return { type: "image", extension };
  if (videoExtensions.includes(extension)) return { type: "video", extension };
  if (audioExtensions.includes(extension)) return { type: "audio", extension };

  return { type: "other", extension };
};

export const getContentType = (extension: string) => {
  if (!extension) return "other";

  let contentType = "application/octet-stream";

  switch (extension) {
    case "mp4":
      contentType = "video/mp4";
      break;
    case "mp3":
      contentType = "audio/mpeg";
      break;
    case "pdf":
      contentType = "application/pdf";
      break;
    case "jpg":
    case "jpeg":
      contentType = "image/jpeg";
      break;
    case "png":
      contentType = "image/png";
      break;
    case "gif":
      contentType = "image/gif";
      break;
    case "webp":
      contentType = "image/webp";
      break;
    case "svg":
      contentType = "image/svg+xml";
      break;
  }

  return contentType;
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const convertFileSize = (size: number, digits?: number) => {
  const units = ["Bytes", "KB", "MB", "GB"];
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(digits || 1)} ${units[unitIndex]}`;
};

export const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString) return "—";

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return dayjs(isoString).tz(userTimezone).format("h:mm A, D MMM YYYY");
};

export const getFileIcon = (
  extension: string | undefined,
  type: FileType | string,
) => {
  switch (extension) {
    // Document
    case "pdf":
      return "file-pdf";
    case "doc":
      return "file-doc";
    case "docx":
      return "file-docx";
    case "csv":
      return "file-csv";
    case "txt":
      return "file-txt";
    case "xls":
    case "xlsx":
      return "file-document";
    // Image
    case "svg":
      return "file-image";
    // Video
    case "mkv":
    case "mov":
    case "avi":
    case "wmv":
    case "mp4":
    case "flv":
    case "webm":
    case "m4v":
    case "3gp":
      return "file-video";
    // Audio
    case "mp3":
    case "mpeg":
    case "wav":
    case "aac":
    case "flac":
    case "ogg":
    case "wma":
    case "m4a":
    case "aiff":
    case "alac":
      return "file-audio";

    default:
      switch (type) {
        case "image":
          return "file-image";
        case "document":
          return "file-document";
        case "video":
          return "file-video";
        case "audio":
          return "file-audio";
        default:
          return "file-other";
      }
  }
};

export const getFileTypesParams = (type: string) => {
  switch (type) {
    case "documents":
      return ["document"];
    case "images":
      return ["image"];
    case "media":
      return ["video", "audio"];
    case "others":
      return ["other"];
    default:
      return ["document"];
  }
};

export const constructFileUrl = (bucketFileId: string) => {
  return `${appwriteConfig.endpointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${bucketFileId}/view?project=${appwriteConfig.projectId}`;
};

export const constructDownloadUrl = (bucketFileId: string) => {
  return `${appwriteConfig.endpointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${bucketFileId}/download?project=${appwriteConfig.projectId}`;
};

export const shareUrl = (bucketFileId: string) => {
  const host = window.location.host;
  const protocol = window.location.protocol;

  return `${protocol}//${host}/viewer/${bucketFileId}`;
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
