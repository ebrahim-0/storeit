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
    icon: "dashboard",
    path: "/home",
  },
  {
    title: "Documents",
    icon: "documents",
    path: "/documents",
  },
  {
    title: "Images",
    icon: "images",
    path: "/images",
  },
  {
    title: "Media",
    icon: "video",
    path: "/media",
  },
  {
    title: "Others",
    icon: "others",
    path: "/others",
  },
];

export const actionsDropdownItems = [
  {
    label: "Rename",
    icon: "edit",
    value: "rename",
  },
  {
    label: "Details",
    icon: "info",
    value: "details",
  },
  {
    label: "Share",
    icon: "share",
    value: "share",
  },
  {
    label: "Download",
    icon: "download",
    value: "download",
  },
  {
    label: "Delete",
    icon: "delete",
    value: "delete",
  },
];

export const actionsDropdownItemsAsShare = [
  {
    label: "Details",
    icon: "info",
    value: "details",
  },
  {
    label: "Share (copy file link)",
    icon: "share",
    value: "share-link",
  },
  {
    label: "Download",
    icon: "download",
    value: "download",
  },
  {
    label: "Remove Share",
    icon: "delete",
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
