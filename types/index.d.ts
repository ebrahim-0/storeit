declare interface IUser {
  $id: string;
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
  role: "admin" | "user";
}

declare interface MediaPlayerProps {
  src: string;
  type: "video" | "audio";
}

declare interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

declare type TypeForm = "login" | "register";

declare type FileType = "document" | "image" | "video" | "audio" | "other";

declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface FormattedDateTimeProps {
  date: string;
  className?: string;
}

declare interface RenderDialogContentProps {
  action: ActionType | null;
  file: Models.Document;
  setAction: (action: any) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setIsDropdownOpen: (isOpen: boolean) => void;
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

declare interface UpdateFileProps {
  fileId: string;
  emails: string[];
  path: string;
}

declare interface InputControllerProps {
  control: Control<any>;
  name: string;
  label?: string;
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
  iconSize?: number;
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
