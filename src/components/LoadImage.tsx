"use client";

import { ImgHTMLAttributes, useState } from "react";

const LoadImage = ({
  loaderSize,
  customLoader,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  loaderSize?: number;
  customLoader?: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          {customLoader ? (
            customLoader
          ) : (
            <div
              className="size-20 animate-spin rounded-full border-4 border-t-4 border-brand/50 border-t-brand-100"
              style={{ width: loaderSize, height: loaderSize }}
            />
          )}
        </div>
      )}

      <img
        {...props}
        style={{ display: isLoading ? "none" : "block" }}
        onError={(e) => {
          console.log("error", e);
        }}
        onLoad={(e) => {
          setIsLoading(false);
          props?.onLoad && props?.onLoad(e);
        }}
      />
    </>
  );
};

export default LoadImage;
