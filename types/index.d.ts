declare interface IUser {
  $id: string;
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
}

declare type FileType = "document" | "image" | "video" | "audio" | "other";

declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}

declare interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

declare interface InputControllerProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
}

interface ThumbnailProps {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}

declare interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}
