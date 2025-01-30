"use client";

import { Dialog, DialogClose } from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionsDropdownItems, actionsDropdownItemsAsShare } from "@/constants";
import { usePathname } from "next/navigation";
import { Models } from "node-appwrite";
import { Fragment, useMemo, useState } from "react";
import { updateFileUsers } from "@/lib/actions/file.action";
import { useSelector } from "zustore";
import { toast } from "sonner";
import Text from "@/components/ui/Text";
import { constructDownloadUrl, shareUrl } from "@/lib/utils";
import Icon from "@/components/Icon";
import { RenderDialogContent } from "./RenderDialogContent";

export const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const path = usePathname();
  const user = useSelector<IUser>("user");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);

  const isSharedWithMe = file?.users.includes(user?.email);

  let dropdownItems = useMemo(() => {
    const isPublic = file?.isPublic;

    if (!isPublic && isSharedWithMe) {
      return actionsDropdownItemsAsShare.filter(
        (item) => item.value !== "share-link",
      );
    }

    return isSharedWithMe ? actionsDropdownItemsAsShare : actionsDropdownItems;
  }, [file, user]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogClose asChild onClick={() => console.log("closed")} />
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="no-focus cursor-default">
          <Icon
            id="dots"
            width={28}
            height={28}
            viewBox="0 0 34 34"
            className="cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px] rounded-[20px] border-0 py-3 shadow-drop-2">
          <DropdownMenuLabel>
            <Text className="max-w-[200px] truncate" tooltip={file.name}>
              {file.name}
            </Text>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dropdownItems.map((actionItem, idx) => {
            return (
              <Fragment
                key={`${actionItem.label}-${Math.random()}-${file.$id}`}
              >
                <DropdownMenuItem
                  onClick={() => {
                    setAction(actionItem);

                    if (actionItem.value === "share-link") {
                      navigator.clipboard
                        .writeText(shareUrl(file?.bucketFileId))
                        .then(() => {
                          toast.success("File url copied to clipboard");
                        });
                    }

                    if (actionItem.value === "remove-share") {
                      const removeMyEmail = file?.users.filter(
                        (fileUser: string) => fileUser !== user?.email,
                      );
                      updateFileUsers({
                        fileId: file.$id,
                        emails: removeMyEmail,
                        path,
                      }).then((res) => {
                        if (res?.error) {
                          toast.error(res.error.message);
                        } else {
                          toast.success("File unshared successfully");
                        }
                      });
                    }

                    if (
                      ["delete", "rename", "share", "details"].includes(
                        actionItem.value,
                      )
                    ) {
                      setIsModalOpen(true);
                      setIsDropdownOpen(false);
                    }
                  }}
                >
                  {actionItem.value === "download" ? (
                    <a
                      // href={`/api/files/${file.bucketFileId}?download=true`}
                      href={constructDownloadUrl(file?.bucketFileId)}
                      download={file.name}
                      target="_self"
                      className="flex items-center gap-2"
                    >
                      <Icon id={actionItem.icon} width={30} height={30} />
                      {actionItem.label}
                    </a>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Icon id={actionItem.icon} width={30} height={30} />
                      {actionItem.label}
                    </div>
                  )}
                </DropdownMenuItem>
                {idx !== dropdownItems.length - 1 && <DropdownMenuSeparator />}
              </Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <RenderDialogContent
        action={action}
        file={file}
        setAction={setAction}
        setIsDropdownOpen={setIsDropdownOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </Dialog>
  );
};
