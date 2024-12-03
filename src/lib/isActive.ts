export const isActive = (pathname: string, path: string) =>
  pathname.endsWith(path) || (path.includes(pathname) && pathname !== "/");
