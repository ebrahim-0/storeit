"use client";

import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import {
  constructFileUrl,
  convertFileSize,
  formatDateTime,
  shareUrl,
} from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import React, { SetStateAction, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CircleCheckBig } from "lucide-react";
import { updateToPublic } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";
import Text from "./ui/Text";
import { toast } from "sonner";
import Icon from "./Icon";
import Loader from "./Loader";

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file?.extension} />
        <DetailRow label="Dimensions:" value={convertFileSize(file?.size)} />
        <DetailRow label="Owner:" value={file?.owner?.fullName} />
        <DetailRow
          label="Last edit:"
          value={formatDateTime(file?.$updatedAt)}
        />
      </div>
    </>
  );
};

export const ShareFile = ({
  file,
  onRemove,
  handleAction,
  setEmail,
  email,
}: {
  file: Models.Document;
  onRemove: (email: string) => Promise<void>;
  handleAction: () => Promise<void>;
  setEmail: React.Dispatch<SetStateAction<string>>;
  email: string;
}) => {
  const [copy, setCopy] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const path = usePathname();

  const handleShare = async () => {
    setIsCopied(true);

    if (!file?.isPublic) {
      const update = await updateToPublic(file?.$id, path);
      setCopy(!!update);
    }

    await navigator.clipboard.writeText(shareUrl(file?.bucketFileId));
    setCopy(true);
    setIsCopied(false);

    toast.success("File url copied");

    setTimeout(() => setCopy(false), 2000);
  };

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="mt-2 space-y-2">
        <p className="subtitle-2 text-light-100">
          Share file with other users:
        </p>

        <Input
          type="email"
          autoComplete="email"
          value={email}
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAction()}
          placeholder="Enter email address"
          className="no-focus body-2 h-[52px] !rounded-[30px] border px-5 py-4 text-light-100 shadow-drop-1 focus:!border"
        />

        <div className="pt-4">
          <div className="flex h-[30px] items-center justify-between">
            {isCopied ? (
              <Loader size={24} strokeWidth={2} />
            ) : copy ? (
              <CircleCheckBig size={18} />
            ) : (
              <Text toolTipAlign="start" tooltip="Share with public">
                <Icon
                  id="share"
                  className="cursor-pointer"
                  width={30}
                  height={30}
                  onClick={handleShare}
                />
              </Text>
            )}

            {file?.isPublic && (
              <Text
                toolTipAlign="end"
                tooltip="File Shared with public with the link"
              >
                <Icon
                  id="globe"
                  className="cursor-pointer"
                  width={18}
                  height={18}
                />
              </Text>
            )}
          </div>
        </div>

        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Share with users</p>
            <p className="subtitle-2 text-light-200">
              {file?.users.length} users
            </p>
          </div>
          <ul className="pt-2">
            {file?.users.map((email: string) => (
              <UserShare key={email} email={email} onRemove={onRemove} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const UserShare = ({
  email,
  onRemove,
}: {
  email: string;
  onRemove: (email: string) => Promise<void>;
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(email);
    setIsRemoving(false);
  };

  return (
    <li className="flex items-center justify-between gap-2">
      <p className="subtitle-2 text-light-100">{email}</p>
      <Button
        onClick={handleRemove}
        disabled={isRemoving}
        className="rounded-full bg-transparent text-light-100 shadow-none hover:bg-transparent"
      >
        {isRemoving ? (
          <Loader size={18} strokeWidth={2} />
        ) : (
          <Icon
            id="remove"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            className="aspect-square"
          />
        )}
      </Button>
    </li>
  );
};

const ImageThumbnail = ({ file }: { file: Models.Document }) => {
  return (
    <div className="border-light-200/40 bg-light-400/50 flex w-full flex-col items-center rounded-xl border-[0.3px] p-3 sm:h-[80px] sm:flex-row">
      <Thumbnail
        type={file.type}
        extension={file.extension}
        // url={`/api/files/${file?.bucketFileId}`}
        url={constructFileUrl(file?.bucketFileId)}
        className="!size-[52px] !min-w-[52px]"
        imageClassName="!size-7"
      />
      <div className="flex flex-col sm:ml-4">
        <Text
          className="subtitle-2 max-w-[200px] truncate text-light-100"
          tooltip={file.name}
          side="bottom"
        >
          {file.name}
        </Text>

        <p className="caption flex text-light-200">
          {convertFileSize(file.size)} -
          <FormattedDateTime
            date={file.$createdAt}
            className="caption ml-0.5 text-light-200"
          />
        </p>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <p className="body-2 w-[35%] text-left text-light-200">{label}</p>
      <p className="subtitle-2 flex-1 text-left">{value}</p>
    </div>
  );
};
