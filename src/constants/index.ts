export const navLinks = (isLogin: any) => {
  return [
    isLogin && { title: "Home", path: "/home" },
    !isLogin && { title: "Login", path: "/login" },
    !isLogin && { title: "Register", path: "/register" },
  ].filter(Boolean);
};

export const sideBarLinks = [
  {
    title: "Dashboard",
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

export const avatarPlaceholderUrl =
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg";

export const MAX_FILE_SIZE = 50 * 1024 * 1024;
