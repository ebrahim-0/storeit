export const navLinks = (isLogin: any) => {
  return [
    isLogin && { title: "Home", path: "/home" },
    !isLogin && { title: "Login", path: "/login" },
    !isLogin && { title: "Register", path: "/register" },
  ].filter(Boolean);
};

export const sideBarLinks = [
  {
    title: "Home",
    icon: "/assets/icons/dashboard.svg",
    path: "/home",
  },
  {
    title: "Documents",
    icon: "/assets/icons/documents.svg",
    path: "/documents",
  },
  {
    title: "Images",
    icon: "/assets/icons/images.svg",
    path: "/images",
  },
  {
    title: "Media",
    icon: "/assets/icons/video.svg",
    path: "/media",
  },
  {
    title: "Others",
    icon: "/assets/icons/others.svg",
    path: "/others",
  },
];

export const actionsDropdownItems = [
  {
    label: "Rename",
    icon: "/assets/icons/edit.svg",
    value: "rename",
  },
  {
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },
  {
    label: "Share",
    icon: "/assets/icons/share.svg",
    value: "share",
  },
  {
    label: "Download",
    icon: "/assets/icons/download.svg",
    value: "download",
  },
  {
    label: "Delete",
    icon: "/assets/icons/delete.svg",
    value: "delete",
  },
];

export const actionsDropdownItemsAsShare = [
  {
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },
  {
    label: "Share (copy file link)",
    icon: "/assets/icons/share.svg",
    value: "share-link",
  },
  {
    label: "Download",
    icon: "/assets/icons/download.svg",
    value: "download",
  },
  {
    label: "Remove Share",
    icon: "/assets/icons/delete.svg",
    value: "remove-share",
  },
];

export const sortTypes = [
  {
    label: "Date created (newest)",
    value: "$createdAt-desc",
  },
  {
    label: "Created Date (oldest)",
    value: "$createdAt-asc",
  },
  {
    label: "Name (A-Z)",
    value: "name-asc",
  },
  {
    label: "Name (Z-A)",
    value: "name-desc",
  },
  {
    label: "Size (Highest)",
    value: "size-desc",
  },
  {
    label: "Size (Lowest)",
    value: "size-asc",
  },
];

export const avatarPlaceholderUrl =
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg";

export const fileType = ["documents", "images", "media", "others"];

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const isPublic = ["/login", "/register"];

export const isHybrid = ["/", "/viewer/[fileId]"];
