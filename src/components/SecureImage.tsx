import { RefAttributes } from "react";

const SecureImage = ({
  appwriteImageUrl,
  ...otherProps
}: {
  appwriteImageUrl: string;
} & RefAttributes<HTMLImageElement>) => {
  const secureUrl = `/api/image-proxy?url=${encodeURIComponent(appwriteImageUrl)}`;

  return <img src={secureUrl} alt="Secure Image" {...otherProps} />;
};

export default SecureImage;
