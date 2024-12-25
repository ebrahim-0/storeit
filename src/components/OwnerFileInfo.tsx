"use client";

import { Models } from "node-appwrite";
import { useSelector } from "zustore";

const OwnerFileInfo = ({ file }: { file: Models.Document }) => {
  const user = useSelector<IUser>("user");
  const isSharedWithMe = file?.users.includes(user?.email);

  return (
    <p className="caption line-clamp-1 text-light-200">
      By: {file?.owner?.fullName}{" "}
      {isSharedWithMe ? (
        <span className="text-brand">- Shared with you</span>
      ) : (
        <span>- (You)</span>
      )}
    </p>
  );
};

export default OwnerFileInfo;
