"use client";

import { Models } from "node-appwrite";
import { useSelector } from "zustore";

const OwnerFileInfo = ({ file }: { file: Models.Document }) => {
  const email = useSelector((state) => state?.user?.email);
  const isSharedWithMe = file?.users.includes(email);

  return (
    <p className="caption text-light-200">
      By: {file?.owner?.fullName}
      {isSharedWithMe ? (
        <span className="text-brand"> - Shared with You</span>
      ) : (
        <span> - (You)</span>
      )}
    </p>
  );
};

export default OwnerFileInfo;
